const functions = require("firebase-functions")
const admin = require("firebase-admin")
const serviceAccount = require("./admin.json")
const moment = require("moment")
const axios = require("axios")
const cors = require("cors")({ origin: true })
const {
  rawCasos,
  rawHospitalizados,
  rawUCI,
  rawFallecidos,
  rawRecuperados,
  rawFechas,
} = require("./rawData")

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://covid-radar.firebaseio.com",
})

const formatDate = date => moment(date.toDate()).format("DD-MM-YYYY HH:mm:ss")

exports.getInfectedData = functions
  .region("europe-west2")
  .https.onRequest((request, response) => {
    cors(request, response, () => {
      if (request.method !== "GET") {
        return response.status(500).json({
          message: "Not allowed",
        })
      }
      admin
        .firestore()
        .doc(
          `${request.query.action}/${request.query.country}${
            request.query.ccaa ? `/ccaa/${request.query.ccaa}` : ""
          }`
        )
        .get()
        .then(snapshot => {
          const data = snapshot.data()
          if (data.fecha) data.fecha = formatDate(data.fecha)
          if (data.lastUpdate) data.lastUpdate = formatDate(data.lastUpdate)
          if (data.pace) {
            data.pace = data.pace.map((dayPace, index) => {
              const yesterday = index > 0 ? data.pace[index - 1].value : 0
              const today = dayPace.value

              return {
                fecha: formatDate(dayPace.fecha),
                porcentualIncrement: (today - yesterday) / today,
                value: dayPace.value,
              }
            })
          }
          response.status(200).send(data)
          return
        })
        .catch(error => {
          console.log(error)
          response.status(500).send(error)
          return
        })
    })
  })

exports.getHistorical = functions
  .region("europe-west2")
  .https.onRequest((request, response) => {
    cors(request, response, () => {
      if (request.method !== "GET") {
        return response.status(500).json({
          message: "Not allowed",
        })
      }
      admin
        .firestore()
        .doc("stats/historical")
        .get()
        .then(snapshot => {
          const data = snapshot.data()
          response.status(200).send(data)
          return
        })
        .catch(error => {
          console.log(error)
          response.status(500).send(error)
          return
        })
    })
  })

const db = admin.firestore()

exports.jeffriBackup = functions
  .region("europe-west2")
  .https.onRequest((req, res) => {
    if (req.method !== "GET") {
      return res.status(403).send("Forbidden!")
    }

    db.doc("stats/spain")
      .get()
      .then(snapshot => {
        const backup = snapshot.data()
        db.doc("backup/spain")
          .set(backup, { merge: true })
          .then(() => {
            res.status(200).send("backup successfull")
          })
          .catch(() => {
            res.status(500).send(error)
          })
      })
      .catch(() => {
        res.status(500).send(error)
      })
  })

const parseDate = (rawDate, rawHour) => {
  let [day, month, year] = rawDate.replace(/de /g, "").split(" ")

  switch (month.toLowerCase()) {
    case "enero":
      month = "01"
      break
    case "febrero":
      month = "02"
      break
    case "marzo":
      month = "03"
      break
    case "abril":
      month = "04"
      break
    case "mayo":
      month = "05"
      break
    case "junio":
      month = "06"
      break
    case "julio":
      month = "07"
      break
    case "agosto":
      month = "08"
      break
    case "septiembre":
      month = "09"
      break
    case "octubre":
      month = "10"
      break
    case "noviembre":
      month = "11"
      break
    case "diciembre":
      month = "12"
      break
    default:
      month = 0
      break
  }

  const date = moment(`${month}/${day}/${year}`).utcOffset(2)
  date.hour(rawHour.split(":")[0])
  return date
}

const calculatePace = casos24h => (casos24h / (24 * 60)).toFixed(2)
const calculatePaceHour = casos24h => (casos24h / 24).toFixed(2)
const calculateIncrement = (casesToday, casesYesterday) =>
  casesToday - casesYesterday
const calculateActive = (casos, recuperados, fallecidos) =>
  casos - recuperados - fallecidos

const manageDB = async (
  parsedDate,
  casos,
  fallecidos,
  recuperados,
  hospitalizados,
  casos24h,
  res
) => {
  const pace = await db
    .doc("stats/spain")
    .get()
    .then(snapshot => {
      const { pace } = snapshot.data()
      return pace ? pace : []
    })
    .catch(error => {
      return null
    })

  const serie = await db
    .doc("stats/historical")
    .get()
    .then(snapshot => {
      const { serie } = snapshot.data()
      return serie ? serie : []
    })
    .catch(error => {
      return null
    })

  const updatedObject = {
    lastUpdate: moment(),
    fecha: parsedDate,
    casos: Number(casos),
    fallecidos: Number(fallecidos),
    recuperados: Number(recuperados),
    hospitalizados: Number(hospitalizados),
    casos24h: Number(casos24h),
    casosActivos: Number(calculateActive(casos, recuperados, fallecidos)),
  }

  const lastPace = pace[pace.length - 1]

  if (pace) {
    if (
      pace.length === 0 ||
      moment(lastPace.fecha.toDate()).format("DD-MM-YYYY:HH:mm") !==
        parsedDate.format("DD-MM-YYYY:HH:mm")
    ) {
      updatedObject.pace = [
        ...pace,
        { fecha: parsedDate, value: Number(calculatePace(casos24h)) },
      ]
    }
  }

  db.doc("stats/spain")
    .set(updatedObject, { merge: true })
    .then(snapshot => {
      res.status(200).send(snapshot)
    })
    .catch(error => {
      res.status(500).send(error)
    })

  let updatedSerie = [
    ...serie,
    {
      casos: updatedObject.casos,
      casos24h: updatedObject.casos24h,
      casosActivos: updatedObject.casosActivos,
      fallecidos: updatedObject.fallecidos,
      fecha: updatedObject.fecha,
      hospitalizados: updatedObject.hospitalizados,
      recuperados: updatedObject.recuperados,
    },
  ]
  db.doc("stats/historical")
    .set({ serie: updatedSerie }, { merge: true })
    .then(historicalSnapshot => {
      console.log("[historicalSnapshot]", historicalSnapshot)
      res.status(200).send(historicalSnapshot)
    })
    .catch(error => {
      console.log("[historicalSnapshot - error]", error)
      res.status(500).send(error)
    })
}

const getFromMinistery = res => {
  axios
    .get("https://covid19.isciii.es/resources/data.csv")
    .then(response => {
      const [
        date,
        hour,
        casos,
        fallecidos,
        recuperados,
        hospitalizados,
        casos24h,
      ] = response.data.split("\n")[1].split(",")

      console.log(
        "[Fecha, Hora, Casos, Defunciones, Recuperados, Hospitalizados, Casos24h]",
        date,
        hour,
        casos,
        fallecidos,
        recuperados,
        hospitalizados,
        casos24h
      )

      const parsedDate = parseDate(date, hour)

      manageDB(
        parsedDate,
        casos,
        fallecidos,
        recuperados,
        hospitalizados,
        casos24h,
        res
      )
    })
    .catch(error => {
      if (res) res.status(500).send(error)
    })
}

exports.jeffri = functions
  .region("europe-west2")
  .https.onRequest((req, res) => {
    if (req.method !== "GET") {
      return res.status(403).send("Forbidden!")
    }

    return cors(req, res, () => {
      getFromMinistery(res)
    })
  })

exports.jeffriTest = functions
  .region("europe-west2")
  .https.onRequest((req, res) => {
    if (req.method !== "GET") {
      return res.status(403).send("Forbidden!")
    }

    return cors(req, res, () => {
      const [
        date,
        hour,
        casos,
        fallecidos,
        recuperados,
        hospitalizados,
        casos24h,
      ] = ["30 de marzo de 2020", "20:00", 944117, 8189, 19259, 49243, 9222]

      const parsedDate = parseDate(date, hour)

      manageDB(
        parsedDate,
        casos,
        fallecidos,
        recuperados,
        hospitalizados,
        casos24h,
        res
      )
    })
  })

exports.jeffriUploader = functions
  .region("europe-west2")
  .https.onRequest((req, res) => {
    if (req.method !== "GET") {
      return res.status(403).send("Forbidden!")
    }

    return cors(req, res, () => {
      let payload = []

      for (let index = 0; index < rawCasos.length; index++) {
        const casos24h = calculateIncrement(
          rawCasos[index],
          index > 0 ? rawCasos[index - 1] : 0
        )
        const hospitalizados24h = calculateIncrement(
          rawHospitalizados[index],
          index > 0 ? rawHospitalizados[index - 1] : 0
        )
        const uci24h = calculateIncrement(
          rawUCI[index],
          index > 0 ? rawUCI[index - 1] : 0
        )
        const fallecidos24h = calculateIncrement(
          rawFallecidos[index],
          index > 0 ? rawFallecidos[index - 1] : 0
        )
        const recuperados24h = calculateIncrement(
          rawRecuperados[index],
          index > 0 ? rawRecuperados[index - 1] : 0
        )
        const activos = calculateActive(
          rawCasos[index],
          rawRecuperados[index],
          rawFallecidos[index]
        )
        const activos24h = calculateIncrement(
          activos,
          index > 0 ? payload[index - 1].activos.value : 0
        )

        payload.push({
          fecha: rawFechas[index],
          casos: {
            value: rawCasos[index],
            increment: casos24h,
            pace: calculatePace(casos24h),
            paceHour: calculatePaceHour(casos24h),
          },
          hospitalizados: {
            value: rawHospitalizados[index],
            increment: hospitalizados24h,
            pace: calculatePace(hospitalizados24h),
            paceHour: calculatePaceHour(hospitalizados24h),
          },
          uci: {
            value: rawUCI[index],
            increment: uci24h,
            pace: calculatePace(uci24h),
            paceHour: calculatePaceHour(uci24h),
          },
          fallecidos: {
            value: rawFallecidos[index],
            increment: fallecidos24h,
            pace: calculatePace(fallecidos24h),
            paceHour: calculatePaceHour(fallecidos24h),
          },
          recuperados: {
            value: rawRecuperados[index],
            increment: recuperados24h,
            pace: calculatePace(recuperados24h),
            paceHour: calculatePaceHour(recuperados24h),
          },
          activos: {
            value: activos,
            increment: activos24h,
            pace: calculatePace(activos24h),
            paceHour: calculatePaceHour(activos24h),
          },
        })
      }

      console.log("[payload]", payload)
      res.status(200).send(payload)
    })
  })

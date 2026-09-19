// =======================
// Cristian Ceni 19/09/26
// Endpoints per stazioni
// =======================

const express = require("express");
const router = express.Router();

// Aggrego le informazioni della stazione e della regione in un unico endpoint anzichè due come su ViaggiaTreno
router.get("/stazione", async (req, res) => {
  const codiceStazione = req.query.codiceStazione;
  const endpointRFI = process.env.ENDPOINT_RFI_VT;

  if (!codiceStazione) {
    return res
      .status(400)
      .json({ error: "Il parametro codiceStazione è obbligatorio." });
  }

  if (!endpointRFI) {
    return res.status(500).json({ error: "Endpoint RFI non configurato." });
  }

  try {
    // Prima richiesta per ottenere il codice della regione
    const rispostaRegione = await fetch(
      `${endpointRFI}/regione/${codiceStazione}`,
    );

    if (!rispostaRegione.ok) {
      return res
        .status(rispostaRegione.status)
        .json({ error: "Errore nella richiesta all'endpoint RFI." });
    }

    const codiceRegione = await rispostaRegione.json();

    // Seconda richiesta per ottenere i dettagli della stazione
    const rispostaStazione = await fetch(
      `${endpointRFI}/dettaglioStazione/${codiceStazione}/${codiceRegione}`,
    );

    if (!rispostaStazione.ok) {
      return res.status(rispostaStazione.status).json({
        error: "Errore nel recupero dei dettagli della stazione.",
      });
    }

    // Risposta finale con i dettagli della stazione che mi interessano non tutta quella roba
    const dettagliStazione = await rispostaStazione.json();
    return res.json({
      codiceStazione: dettagliStazione.codiceStazione,
      nomeCorto: dettagliStazione.localita?.nomeBreve ?? null,
      nomeLungo: dettagliStazione.localita?.nomeLungo ?? null,
      latitudine: dettagliStazione.lat ?? null,
      longitudine: dettagliStazione.lon ?? null,
    });
  } catch (error) {
    console.error("Errore durante la richiesta a RFI:", error);
    return res.status(500).json({ error: "Errore interno del server." });
  }
});

// Endpoint per ottenere le partenze della stazione
router.get("/stazione/partenze", async (req, res) => {
  const codiceStazione = req.query.codiceStazione;
  const endpointRFI = process.env.ENDPOINT_RFI_VT;

  if (!codiceStazione) {
    return res
      .status(400)
      .json({ error: "Il parametro codiceStazione è obbligatorio." });
  }

  if (!endpointRFI) {
    return res.status(500).json({ error: "Endpoint RFI non configurato." });
  }

  const dataAttuale = encodeURIComponent(new Date().toString());

  try {
    const risposta = await fetch(
      `${endpointRFI}/partenze/${codiceStazione}/${dataAttuale}`,
    );

    if (!risposta.ok) {
      return res
        .status(risposta.status)
        .json({ error: "Errore nella richiesta all'endpoint RFI." });
    }

    const partenze = await risposta.json();
    return res.json(partenze);
  } catch (error) {
    console.error("Errore durante la richiesta a RFI:", error);
    return res.status(500).json({ error: "Errore interno del server." });
  }
});

module.exports = router;

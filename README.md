# Documenti vari e appunti per Treninfo

- Scritto da Cristian Ceni 19/09/26

## Il progetto

Oggi mi impegno a riportare in vita il progetto [Treninfo](https://treninfo.cenidev.com) ormai deprecato e da riguardare.
Sto lavorando scrivendo il codice manualmente percui i commit saranno molto meno corposi rispetto a scrivendo il codice con agente LLM.

Qui sotto ci sono miei appunti sul funzionamento del backend API di ViaggiaTreno con gli endpoint che RFI chiama.

Sembra che RFI stia un minimo impedendo lo scraping, proprio perchè aprendo ispeziona l'elemento, si viene costante fermati dal debugger che lancia errori di continuo non permettendoti una visione d'ambiente ottimale, nulla da dire che spammando il `resume` si riescono comunque a vedere tutte le chiamate fatte.

### Nota:

Non ci sono variabili d'ambiente secret, percui non inserirò `.env` dentro `.gitignore`.

## Endpoint di RFI

### Ricerca di una stazione

- RFI chiama prima `http://www.viaggiatreno.it/infomobilita/resteasy/viaggiatreno/regione/S06421` per la stazione di `Firenze S.M.N.` con il suo codice `S06421` e riceve come risposta `13` che è il codice regione per la `Toscana`.

Risposta:

```json
13
```

- Dopodichè parte la richiesta a `http://www.viaggiatreno.it/infomobilita/resteasy/viaggiatreno/dettaglioStazione/S06421/13` che mostra le info della stazione, boh.

Risposta:

```json
{
  "key": "S06421_13",
  "codReg": 13,
  "tipoStazione": 1,
  "dettZoomStaz": [
    {
      "key": "S06421_13",
      "codiceStazione": "S06421",
      "zoomStartRange": 8,
      "zoomStopRange": 9,
      "pinpointVisibile": true,
      "pinpointVisible": true,
      "labelVisibile": true,
      "labelVisible": true,
      "codiceRegione": 13
    },
    {
      "key": "S06421_13",
      "codiceStazione": "S06421",
      "zoomStartRange": 10,
      "zoomStopRange": 11,
      "pinpointVisibile": true,
      "pinpointVisible": true,
      "labelVisibile": true,
      "labelVisible": true,
      "codiceRegione": 13
    }
  ],
  "pstaz": [],
  "mappaCitta": {
    "urlImagePinpoint": "",
    "urlImageBaloon": ""
  },
  "codiceStazione": "S06421",
  "codStazione": "S06421",
  "lat": 43.776893,
  "lon": 11.247373,
  "latMappaCitta": 0.0,
  "lonMappaCitta": 0.0,
  "localita": {
    "nomeLungo": "FIRENZE SANTA MARIA NOVELLA",
    "nomeBreve": "FIRENZE S.M.N.",
    "label": "Firenze",
    "id": "S06421"
  },
  "esterno": false,
  "offsetX": 20,
  "offsetY": 0,
  "nomeCitta": "Firenze"
}
```

Per riciclare questi dati a me fondamentalmente interessano:

- `lat` e `lon` se volessi indicarla su una mappa come feci nella prima versione.
- `nomeLungo` da valutare, magari usabile per la ricerca.
- `nomeBreve` sicuramente da usare come nome mostrato all'utente.
- `label` e `nomeCitta` sono in questo caso ridondanti però può essere che queste API vengano usate da chissà quali servizi oltre che [ViaggiaTreno](http://viaggiatreno.it)

### Partenze e arrivi da una stazione

Durante la ricerca stazione vengono ricercati anche partenze e arrivi, giustamente.

- Endpoint: `http://www.viaggiatreno.it/infomobilita/resteasy/viaggiatreno/partenze/S06421/Sat%20Sep%2019%202026%2017:11:23%20GMT+0200%20(Ora%20legale%20dell%E2%80%99Europa%20centrale)`.

- Qui RFI chiama `http://www.viaggiatreno.it/infomobilita/resteasy/viaggiatreno/partenze/S06421/` e ci aggiunge la data in formato `GiornoSettimana Mese GiornoMese Anno HH:mm:ss FusoOrario` un timestamp analogo a quello restituito da `Date.prototype.toString()`

Risposta:
```json
{
        "arrivato": true,
        "dataPartenzaTrenoAsDate": "2026-09-19",
        "dataPartenzaTreno": 1789768800000,
        "partenzaTreno": 1789838700000,
        "millisDataPartenza": "1789768800000",
        "numeroTreno": 9328,
        "categoria": "",
        "categoriaDescrizione": " FR",
        "origine": null,
        "codOrigine": "S08409",
        "destinazione": "MANTOVA",
        "codDestinazione": null,
        "origineEstera": null,
        "destinazioneEstera": null,
        "oraPartenzaEstera": null,
        "oraArrivoEstera": null,
        "tratta": 0,
        "regione": 0,
        "origineZero": null,
        "destinazioneZero": null,
        "orarioPartenzaZero": null,
        "orarioArrivoZero": null,
        "circolante": true,
        "codiceCliente": 1,
        "binarioEffettivoArrivoCodice": null,
        "binarioEffettivoArrivoDescrizione": null,
        "binarioEffettivoArrivoTipo": null,
        "binarioProgrammatoArrivoCodice": null,
        "binarioProgrammatoArrivoDescrizione": null,
        "binarioEffettivoPartenzaCodice": "0",
        "binarioEffettivoPartenzaDescrizione": "11",
        "binarioEffettivoPartenzaTipo": "0",
        "binarioProgrammatoPartenzaCodice": null,
        "binarioProgrammatoPartenzaDescrizione": "9",
        "subTitle": null,
        "esisteCorsaZero": null,
        "orientamento": "A",
        "inStazione": true,
        "haCambiNumero": false,
        "nonPartito": false,
        "provvedimento": 0,
        "riprogrammazione": "N",
        "orarioPartenza": 1789845000000,
        "orarioArrivo": null,
        "stazionePartenza": null,
        "stazioneArrivo": null,
        "statoTreno": null,
        "corrispondenze": [],
        "servizi": [],
        "ritardo": 14,
        "tipoProdotto": "100",
        "compOrarioPartenzaZeroEffettivo": "21:10",
        "compOrarioArrivoZeroEffettivo": null,
        "compOrarioPartenzaZero": "21:10",
        "compOrarioArrivoZero": null,
        "compOrarioArrivo": null,
        "compOrarioPartenza": "21:10",
        "compNumeroTreno": " FR 9328",
        "compOrientamento": [
            "Executive in coda",
            "Executive at the rear",
            "Executive Zugende",
            "Executive en queue",
            "Executive al final del tren",
            "Executive la coada trenului",
            "背面のExecutive",
            "Executive在后几节车厢",
            "Executive в хвосте поезда"
        ],
        "compTipologiaTreno": "nazionale",
        "compClassRitardoTxt": "",
        "compClassRitardoLine": "regolare_line",
        "compImgRitardo2": "/vt_static/img/legenda/icone_legenda/regolare.png",
        "compImgRitardo": "/vt_static/img/legenda/icone_legenda/regolare.png",
        "compRitardo": [
            "ritardo 14 min.",
            "delay 14 min.",
            "Versp&#228;tung 14 Min.",
            "retard de 14 min.",
            "retraso de 14 min.",
            "&icirc;nt&acirc;rziere 14 min.",
            "遅延 14 分",
            "误点 14分钟",
            "опоздание на 14 минут"
        ],
        "compRitardoAndamento": [
            "con un ritardo di 14 min.",
            "14 minutes late",
            "mit einer Verz&#246;gerung von 14 Min.",
            "avec un retard de 14 min.",
            "con un retraso de 14 min.",
            "cu o &icirc;nt&acirc;rziere de 14 min.",
            "14 分の遅延",
            "误点 14分钟",
            "с опозданием в 14 минут"
        ],
        "compInStazionePartenza": [
            "Partito",
            "Departed",
            "angef&#228;hrt",
            "Partit",
            "Salido",
            "Plecat",
            "発車済",
            "已出发",
            "отправленный"
        ],
        "compInStazioneArrivo": [
            "Arrivato",
            "Arrived",
            "angekommen",
            "Arriv&eacute;",
            "Llegado",
            "Sosit",
            "到着済",
            "已到达",
            "прибывший"
        ],
        "compOrarioEffettivoArrivo": null,
        "compDurata": "",
        "compImgCambiNumerazione": "&nbsp;&nbsp;",
        "materiale_label": null,
        "ultimoRilev": 1789845840000,
        "iconTreno": null
    },
```

Questo è estrapolato dal JSON completo delle partenze di `Firenze S.M.N.`. Per ora merita tenerli proprio tutti.

### Appunto noioso:

L'origine leggibile è `null`ma viene passata con il codice stazione, mentre la destinazione per intera ma senza codice.
No sense però.

```json
  "origine": null,
  "codOrigine": "S06421",
  "destinazione": "LIVORNO CENTRALE",
  "codDestinazione": null,
```

### Test di chiamata sul backend

- Con il backend di Treninfo, l'idea è quella di ridurre questi passaggi di chiamate strani di ViaggiaTreno e racchiudere gli endpoint in maniera più chiara, più che altro perchè il reale casino arriva dopo con l'inserimento degli endpoint `LeFrecce`.

Prima versione con 2 chiamate aggregate in una:

```js
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
```

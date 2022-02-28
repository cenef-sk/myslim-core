let emailTemplates = {};

emailTemplates.activationEmail = (code) =>
`Ďakujeme za vašu registráciu.

Pre aktiváciu vášho konta prosím kliknite na nasledujúci link:

https://kurz.myslim.eu/activation/${code}

Prajeme veľa pozitívnych zážitkov zo vzdelávania.

S pozdravom tím myslim.eu
`


emailTemplates.forgotSubject = (lng) => {
  if (lng == "SK") {
    return "Zmena hesla kurz.myslim.eu"
  } else if (lng == "CZ") {
    return "Změna hesla kurz.myslim.eu"
  } else {
    return "Password change kurz.myslim.eu"
  }
}


emailTemplates.forgotEmail = (lng, token) => {
  let link = "https://kurz.myslim.eu/reset?token=" + token
  if (lng == "SK") {
    return emailTemplates.forgotEmailSK(link)
  } else if (lng == "CZ") {
    return emailTemplates.forgotEmailCZ(link)
  } else {
    return emailTemplates.forgotEmailEN(link)
  }
}

emailTemplates.forgotEmailSK = (link) =>
`Dobrý deň,

na stránke kurz.myslim.eu ste zažiadali o zmenu hesla.

Kliknite prosím na nasledujúci link:

${link}

Ak ste o zmenu hesla nežiadali, tak tento email ignorujte.

S pozdravom tím myslim.eu
`

emailTemplates.forgotEmailCZ = (link) =>
`Dobrý den,

na stránce kurz.myslim.eu jste zažádali o změnu hesla.

Klikněte prosím na následující link:

${link}

Pokud jste o změnu hesla nežádali, tak tento email ignorujte.

S pozdravem tým myslim.eu
`

emailTemplates.forgotEmailEN = (link) =>
`Dear Sir or Madam

you have requested a password change on kurz.myslim.eu.

Please click on the following link:

${link}

If you did not request a password change, please disregard this email.

Sincerely, myslim.eu team
`




emailTemplates.passwordReset = () =>
`test

https://kurz.myslim.eu/

ako funguje`

emailTemplates.reset = () =>
`test

https://kurz.myslim.eu/

ako funguje`

emailTemplates.reset = () =>
`test

https://kurz.myslim.eu/

ako funguje`

emailTemplates.reset = () =>
`test

https://kurz.myslim.eu/

ako funguje`


module.exports = emailTemplates;

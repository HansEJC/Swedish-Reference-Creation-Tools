const reftext = document.querySelector(`#reftext`);
const output = document.querySelector(`#output`);
/** Selects textarea on focus*/
const select = (e) => e.target.select();
document.querySelectorAll(`textarea`).forEach(tex => tex.addEventListener(`focus`, select));

/**
 * Riksarkivet Function
 * @returns The reference string
 */
function riksarkivet() {
  const arr = reftext.value.split(`, bildid: `);
  const [part1, part2] = arr;
  const arr2 = part2.split(`,`);
  let [pageref, pagetext] = arr2;

  if (typeof pagetext === 'undefined') {
    pagetext = ``;
  }

  const ralink = ` [https://sok.riksarkivet.se/ Riksarkivet] `;
  const riksref = `<ref>${part1}\n:${ralink}[https://sok.riksarkivet.se/bildvisning/${pageref} View source] ${pageref}${pagetext}\n</ref>`;
  return riksref;
}

/**
 * Arkiv Digital Function
 * @returns The reference string, including a link to riksarkivet
 */
function arkivdigital() {
  const newtext = reftext.value.replace(/"|'/g, "");

  const arr = newtext.split(` \(AID: <a href=`);

  const [part1, part2] = arr;

  const arr2 = part2.split(`</a> <a href=`);
  const [part3, part4] = arr2;

  const p31 = part3.split(`>`);
  const [aid1, aid2] = p31;

  const aid = `[${aid1} page info] ${aid2}`;

  const p41 = part4.split(`>`);
  const aidlink = ` | [${p41[0]} To page (paywall)]`;

  const part5 = p41[3];
  const nad1 = part5.split(`<`)[0];

  const nad = ` | [https://sok.riksarkivet.se/?postid=ArkisRef%20${nad1} Riksarkivet]`;
  const adlink = ` [https://sv.wikipedia.org/wiki/Arkivdigital Arkiv Digital] `;

  reftext.value = ``;
  const arkivref = `<ref>${part1}\n${adlink}${aid}${aidlink}${nad}}\n</ref>`;
  return arkivref;
}

/**
 * Dödbok Function
 * @returns The reference string in a easier to view format.
 */
function deadbook() {
  const ref = reftext.value.replaceAll(`\n`, `\n::`);
  const deadref = `<ref>[https://sv.wikipedia.org/wiki/Sveriges_d%C3%B6dbok SDB Sveriges d\u00F6dbok]\n::${ref}\n</ref>`;
  return deadref;
}

/**
 * Soldatregister Function
 * @returns The reference string
 */
function soldatregister() {
  const ref = reftext.value.replaceAll(`\n`, `\n::`);

  const date = new Date();
  const [, day, month, year] = date.toGMTString().split(` `);

  const solref = `<ref>Sök I soldatregistret. Accessed ${day} ${month} ${year}.\n::${ref}https://soldat.elektronikhuset.it/soldatregister/</ref>`;
  return solref;
}

/**
 * Copy function when button is pressed. Copies directly to clipboard
 */
function copy() {
  reftext.value = ``;
  output.select();
  navigator.clipboard.writeText(output.value);
}

/**
 * Checks type of reference in input field and writes output reference.
 */
function getRef() {
  const refval = reftext.value;
  const errtext = `Sorry, it seems not to be the correct kind of reference for this tool.`;
  output.value = refval.includes(`bildid:`) ? riksarkivet() :
    refval.includes(`AID:`) ? arkivdigital() :
      refval.includes(`bokf`) ? deadbook() :
        refval.includes(`egement`) ? soldatregister() :
          errtext;
}

document.querySelector(`button`).addEventListener(`click`, copy);
reftext.addEventListener(`keyup`, getRef);


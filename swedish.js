const reftext = document.querySelector(`#reftext`);
const output = document.querySelector(`#output`);
document.querySelector(`button`).addEventListener(`click`, copy);
reftext.addEventListener(`keyup`, getRef);
const select = (e) => e.target.select();
document.querySelectorAll(`textarea`).forEach(tex => tex.addEventListener(`focus`, select));

function getRef() {
    const refval = reftext.value;
    const errtext = `Sorry, it seems not to be the correct kind of reference for this tool.`;
    output.value = refval.includes(`bildid:`) ? riksarkivet() :
        refval.includes(`AID:`) ? arkivdigital() :
            refval.includes(`kobok`) ? deadbook() :
                errtext;
}

function riksarkivet() {
    const arr = reftext.value.split(`, bildid: `);
    const [part1, part2] = arr;
    const arr2 = part2.split(`,`);
    let [pageref, pagetext] = arr2;

    if (typeof pagetext == 'undefined') {
        pagetext = ``;
    }

    const ralink = ` [https://sok.riksarkivet.se/ Riksarkivet] `;
    const riksref = `<ref>${part1}\n:${ralink}[https://sok.riksarkivet.se/bildvisning/${pageref} View source] ${pageref}${pagetext}\n</ref>`;
    return riksref;
}

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

    var part5 = p41[3];
    const nad1 = part5.split(`<`)[0];

    const nad = ` | [https://sok.riksarkivet.se/?postid=ArkisRef%20${nad1} Riksarkivet]`;
    const adlink = ` [https://sv.wikipedia.org/wiki/Arkivdigital Arkiv Digital] `;

    reftext.value = ``;
    const arkivref = `<ref>${part1}\n${adlink}${aid}${aidlink}${nad}}\n</ref>`;
    return arkivref;
}

function deadbook() {
    const ref = reftext.value.replaceAll(`\n`, `\n::`);
    const deadref = `<ref>[https://sv.wikipedia.org/wiki/Sveriges_d%C3%B6dbok SDB Sveriges d\u00F6dbok]\n::${ref}\n</ref>`;
    return deadref;
}

function copy() {
    reftext.value = ``;
    output.select();
    navigator.clipboard.writeText(output.value);
}
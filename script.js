// ─────────────────────────────────────────────
// MNND Certified Pedigree — script.js
// ─────────────────────────────────────────────

const TABLE_NAME = 'pedigrees';

const ANC_MID = [
  [3, 'Sire-ийн эцэг'],
  [4, 'Sire-ийн эх'],
  [5, 'Dam-ийн эцэг'],
  [6, 'Dam-ийн эх'],
];

const ANC_RIGHT = [
  [7,  '3-ийн эцэг'], [8,  '3-ийн эх'],
  [9,  '4-ийн эцэг'], [10, '4-ийн эх'],
  [11, '5-ийн эцэг'], [12, '5-ийн эх'],
  [13, '6-ийн эцэг'], [14, '6-ийн эх'],
];

document.addEventListener('DOMContentLoaded', () => {
  renderAncestors();
});

function renderAncestors() {
  const midEl = document.getElementById('ped-mid');
  ANC_MID.forEach(([n, label]) => {
    midEl.innerHTML += `<div>
      <span style="font-size:7px;font-weight:700;color:#555;font-family:Arial;">${n}.</span>
      <span style="font-size:6px;color:#777;font-family:Arial;"> ${label}</span>
      <input class="anc-input" id="anc_${n}" />
    </div>`;
  });

  const rightEl = document.getElementById('ped-right');
  ANC_RIGHT.forEach(([n, label]) => {
    rightEl.innerHTML += `<div style="margin-bottom:3px;">
      <span style="font-size:7px;font-weight:700;color:#555;font-family:Arial;">${n}.</span>
      <span style="font-size:6px;color:#777;font-family:Arial;"> ${label}</span>
      <input class="anc-input" id="anc_${n}" />
    </div>`;
  });
}

function setStatus(msg, type) {
  const el = document.getElementById('tstat');
  el.textContent = msg;
  el.className = 'tstat ' + (type || '');
}

function getValue(id) {
  const el = document.getElementById(id);
  return el ? el.value : '';
}

function getFormData() {
  const data = {
    reg_no:          getValue('reg_no'),
    reg_date:        getValue('reg_date'),
    name:            getValue('name'),
    breed:           getValue('breed'),
    color:           getValue('color'),
    sex:             getValue('sex'),
    dob:             getValue('dob'),
    microchip:       getValue('microchip'),
    owner_name:      getValue('owner_name'),
    owner_address:   getValue('owner_address'),
    breeder_name:    getValue('breeder_name'),
    breeder_address: getValue('breeder_address'),
    breeder_station: getValue('breeder_station'),
    sire_name:       getValue('sire_name'),
    sire_reg:        getValue('sire_reg'),
    dam_name:        getValue('dam_name'),
    dam_reg:         getValue('dam_reg'),
    mnn1:            getValue('mnn1'),
    mnn2:            getValue('mnn2'),
    mnn3:            getValue('mnn3'),
    other_award:     getValue('other_award'),
    signature:       getValue('signature'),
    sign_date:       getValue('sign_date'),
    created_at:      new Date().toISOString(),
  };
  [...ANC_MID, ...ANC_RIGHT].forEach(([n]) => {
    data['anc_' + n] = getValue('anc_' + n);
  });
  return data;
}

async function handleSave() {
  const url = (document.getElementById('cfg-url').value || '').trim();
  const key = (document.getElementById('cfg-key').value || '').trim();
  if (!url || !key) {
    setStatus('⚠ Суурь URL болон Anon Key оруулна уу', 'err');
    return;
  }
  const data = getFormData();
  if (!data.name) {
    setStatus('⚠ Нохойн нэр заавал оруулна уу', 'err');
    return;
  }
  setStatus('Хадгалж байна...', 'loading');
  try {
    const res = await fetch(url + '/rest/v1/' + TABLE_NAME, {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        'apikey':        key,
        'Authorization': 'Bearer ' + key,
        'Prefer':        'return=minimal',
      },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      setStatus('✓ "' + data.name + '" амжилттай хадгалагдлаа! (Reg# ' + data.reg_no + ')', 'ok');
    } else {
      setStatus('Алдаа: ' + await res.text(), 'err');
    }
  } catch (err) {
    setStatus('Сүлжээний алдаа: ' + err.message, 'err');
  }
}

function handlePrint() {
  window.print();
}

function handleReset() {
  if (!confirm('Бүх талбарыг цэвэрлэх үү?')) return;
  document.querySelectorAll('input:not(#cfg-url):not(#cfg-key), select, textarea').forEach(el => {
    el.value = '';
  });
  document.getElementById('reg_no_display').textContent = '____';
  setStatus('');
}
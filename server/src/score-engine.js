// Calculo do escore de risco para Sindrome do X Fragil.
//
// Como funciona:
// 1. Cada sintoma tem um peso base (definido no catalogo, editavel pelo admin).
// 2. Sintomas marcados como "applies_to: male" so contam para pacientes do sexo masculino.
// 3. Em pacientes do sexo feminino, sintomas comportamentais/cognitivos contam um pouco
//    menos (fator 0.7), porque a manifestacao em mulheres tende a ser mais branda
//    (X Fragil eh ligado ao cromossomo X, e mulheres tem um X "saudavel" compensando).
// 4. O total eh comparado ao limiar (configuravel pelo admin) para sugerir
//    o encaminhamento ao teste genetico.

const FEMALE_FACTOR = 0.7;

function weightForSymptom(symptom, patientSex) {
  // sintoma so se aplica a um sexo especifico?
  if (symptom.applies_to === 'male' && patientSex !== 'M') return 0;
  if (symptom.applies_to === 'female' && patientSex !== 'F') return 0;

  let weight = symptom.base_weight;

  // ajuste por sexo: feminino tende a ser menos expressivo
  if (patientSex === 'F' && symptom.category !== 'fisica') {
    weight *= FEMALE_FACTOR;
  }

  return weight;
}

function calculateScore({ symptoms, selectedKeys, patientSex, threshold }) {
  const selected = new Set(selectedKeys || []);

  let total = 0;
  let max = 0;
  const breakdown = [];

  for (const symptom of symptoms) {
    if (!symptom.active) continue;
    const applicable = weightForSymptom(symptom, patientSex);
    if (applicable === 0) continue; // nao aplicavel a esse sexo

    max += applicable;
    const isPresent = selected.has(symptom.key);
    if (isPresent) total += applicable;

    breakdown.push({
      symptom_id: symptom.id,
      key: symptom.key,
      present: isPresent,
      weight_applied: applicable,
    });
  }

  return {
    total: round(total),
    max: round(max),
    percent: max === 0 ? 0 : Math.round((total / max) * 100),
    threshold,
    refer: total >= threshold,
    breakdown,
  };
}

function round(n) {
  return Math.round(n * 10) / 10;
}

module.exports = { calculateScore };

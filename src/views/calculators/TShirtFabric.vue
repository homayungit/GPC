<template>
  <div>
    <div class="mb-5">
      <h1 class="page-title">👕 T-Shirt Fabric Consumption</h1>
      <p class="page-subtitle">Calculate knitted fabric required to produce T-shirts based on garment measurements.</p>
    </div>

    <div class="section-card mb-4">
      <h2 class="text-sm font-bold text-gray-600 uppercase tracking-wide mb-4">Garment Measurements (cm)</h2>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="calc-label">Body Length (cm) <span class="text-red-500">*</span></label>
          <input v-model.number="form.bodyLength" type="number" min="0" step="0.5" placeholder="e.g. 72" class="calc-input" />
        </div>
        <div>
          <label class="calc-label">Chest Width (cm) <span class="text-red-500">*</span></label>
          <input v-model.number="form.chest" type="number" min="0" step="0.5" placeholder="e.g. 54" class="calc-input" />
          <p class="text-xs text-gray-400 mt-0.5">Half-chest × 2 = full width</p>
        </div>
        <div>
          <label class="calc-label">Sleeve Length (cm) <span class="text-red-500">*</span></label>
          <input v-model.number="form.sleeveLength" type="number" min="0" step="0.5" placeholder="e.g. 22" class="calc-input" />
        </div>
        <div>
          <label class="calc-label">Sleeve Width/Opening (cm) <span class="text-red-500">*</span></label>
          <input v-model.number="form.sleeveWidth" type="number" min="0" step="0.5" placeholder="e.g. 20" class="calc-input" />
          <p class="text-xs text-gray-400 mt-0.5">Half-sleeve × 2 = full width</p>
        </div>
      </div>
    </div>

    <div class="section-card mb-4">
      <h2 class="text-sm font-bold text-gray-600 uppercase tracking-wide mb-4">Fabric & Production Details</h2>
      <div class="space-y-4">
        <div>
          <label class="calc-label">GSM (grams per square metre) <span class="text-red-500">*</span></label>
          <input v-model.number="form.gsm" type="number" min="0" step="1" placeholder="e.g. 180" class="calc-input" />
        </div>
        <div>
          <label class="calc-label">Wastage / Cutting Loss (%) <span class="text-red-500">*</span></label>
          <input v-model.number="form.wastage" type="number" min="0" max="50" step="0.5" placeholder="e.g. 12" class="calc-input" />
          <p class="text-xs text-gray-400 mt-1">Typical: 10–15% for knits</p>
        </div>
        <div>
          <label class="calc-label">Quantity of T-shirts <span class="text-red-500">*</span></label>
          <input v-model.number="form.qty" type="number" min="1" step="1" placeholder="e.g. 1000" class="calc-input" />
        </div>
      </div>
      <div class="grid grid-cols-2 gap-3 mt-5">
        <button @click="calculate" class="calc-btn">Calculate</button>
        <button @click="reset" class="calc-btn-secondary">Reset</button>
      </div>
    </div>

    <div v-if="result !== null" class="section-card">
      <h2 class="text-sm font-bold text-gray-600 uppercase tracking-wide mb-3">Results</h2>
      <div class="grid grid-cols-2 gap-3 mb-3">
        <div class="result-box text-center">
          <div class="result-value">{{ result.gramsPerPiece }}</div>
          <div class="result-label">Grams per T-shirt</div>
        </div>
        <div class="result-box text-center">
          <div class="result-value">{{ result.kgPerPiece }}</div>
          <div class="result-label">Kg per T-shirt</div>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-3 mb-3">
        <div class="bg-gray-50 border border-gray-200 rounded-xl p-3 text-center">
          <div class="text-xl font-bold text-gray-700">{{ result.totalKg }}</div>
          <div class="text-xs text-gray-500 mt-0.5">Total Fabric (kg)</div>
        </div>
        <div class="bg-gray-50 border border-gray-200 rounded-xl p-3 text-center">
          <div class="text-xl font-bold text-gray-700">{{ result.totalKgWithWastage }}</div>
          <div class="text-xs text-gray-500 mt-0.5">With Wastage (kg)</div>
        </div>
      </div>
      <div class="formula-box mt-2">
        Body area = (Body Length + 4cm) × (Chest + 4cm) × 2 (for Front & Back)<br>
        Sleeve area = (Sleeve Length + 3cm) × (Sleeve Width + 3cm) × 2 (for 2 sleeves)<br>
        Fabric (g) = (Body + Sleeve area in cm²) × GSM / 10,000<br>
        Total with wastage = Fabric × Qty × (1 + Wastage%)
      </div>
    </div>

    <div v-if="error" class="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">{{ error }}</div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'

const form = reactive({ bodyLength: null, chest: null, sleeveLength: null, sleeveWidth: null, gsm: null, wastage: 12, qty: 1 })
const result = ref(null)
const error = ref('')

function calculate() {
  error.value = ''; result.value = null
  const { bodyLength, chest, sleeveLength, sleeveWidth, gsm, wastage, qty } = form
  if (!bodyLength || !chest || !sleeveLength || !sleeveWidth) return (error.value = 'Enter all garment measurements.')
  if (!gsm || gsm <= 0)   return (error.value = 'Enter a valid GSM.')
  if (wastage < 0)        return (error.value = 'Wastage cannot be negative.')
  if (!qty || qty <= 0)   return (error.value = 'Enter a valid quantity.')

  // Standard allowances: 4cm body, 3cm sleeve
  const bodyArea   = (bodyLength + 4) * (chest + 4) * 2          // cm² for front + back
  const sleeveArea = (sleeveLength + 3) * (sleeveWidth + 3) * 2  // cm² for 2 sleeves
  const totalArea  = bodyArea + sleeveArea                         // cm²

  const gramsPerPiece          = (totalArea * gsm) / 10000
  const kgPerPiece             = gramsPerPiece / 1000
  const totalKg                = kgPerPiece * qty
  const totalKgWithWastage     = totalKg * (1 + wastage / 100)

  result.value = {
    gramsPerPiece:      parseFloat(gramsPerPiece.toFixed(2)),
    kgPerPiece:         parseFloat(kgPerPiece.toFixed(4)),
    totalKg:            parseFloat(totalKg.toFixed(3)),
    totalKgWithWastage: parseFloat(totalKgWithWastage.toFixed(3)),
  }
}

function reset() {
  Object.assign(form, { bodyLength: null, chest: null, sleeveLength: null, sleeveWidth: null, gsm: null, wastage: 12, qty: 1 })
  result.value = null; error.value = ''
}
</script>

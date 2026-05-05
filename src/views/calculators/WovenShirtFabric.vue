<template>
  <div>
    <div class="mb-5">
      <h1 class="page-title">👔 Woven Shirt Fabric Consumption</h1>
      <p class="page-subtitle">Calculate woven fabric required to produce shirts, based on garment dimensions and fabric width.</p>
    </div>

    <div class="section-card mb-4">
      <h2 class="text-sm font-bold text-gray-600 uppercase tracking-wide mb-4">Garment Measurements (cm)</h2>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="calc-label">Shirt Body Length (cm) <span class="text-red-500">*</span></label>
          <input v-model.number="form.bodyLength" type="number" min="0" step="0.5" placeholder="e.g. 75" class="calc-input" />
        </div>
        <div>
          <label class="calc-label">Chest Width (cm) <span class="text-red-500">*</span></label>
          <input v-model.number="form.chest" type="number" min="0" step="0.5" placeholder="e.g. 52" class="calc-input" />
          <p class="text-xs text-gray-400 mt-0.5">Half chest measurement</p>
        </div>
        <div>
          <label class="calc-label">Sleeve Length (cm) <span class="text-red-500">*</span></label>
          <input v-model.number="form.sleeveLength" type="number" min="0" step="0.5" placeholder="e.g. 64" class="calc-input" />
        </div>
        <div>
          <label class="calc-label">Sleeve Width (cm) <span class="text-red-500">*</span></label>
          <input v-model.number="form.sleeveWidth" type="number" min="0" step="0.5" placeholder="e.g. 22" class="calc-input" />
          <p class="text-xs text-gray-400 mt-0.5">Bicep width (half)</p>
        </div>
        <div>
          <label class="calc-label">Collar Height (cm)</label>
          <input v-model.number="form.collar" type="number" min="0" step="0.5" placeholder="e.g. 8" class="calc-input" />
        </div>
        <div>
          <label class="calc-label">Cuff Height (cm)</label>
          <input v-model.number="form.cuff" type="number" min="0" step="0.5" placeholder="e.g. 7" class="calc-input" />
        </div>
      </div>
    </div>

    <div class="section-card mb-4">
      <h2 class="text-sm font-bold text-gray-600 uppercase tracking-wide mb-4">Fabric Details</h2>
      <div class="space-y-4">
        <div>
          <label class="calc-label">Fabric Width (cm) <span class="text-red-500">*</span></label>
          <input v-model.number="form.fabricWidth" type="number" min="0" step="1" placeholder="e.g. 150" class="calc-input" />
          <p class="text-xs text-gray-400 mt-1">Common widths: 110cm, 145cm, 150cm, 60" (152cm)</p>
        </div>
        <div>
          <label class="calc-label">Marker Efficiency (%) <span class="text-red-500">*</span></label>
          <input v-model.number="form.markerEff" type="number" min="50" max="100" step="1" placeholder="e.g. 85" class="calc-input" />
          <p class="text-xs text-gray-400 mt-1">Fabric utilization in marker. Typical: 80–88%</p>
        </div>
        <div>
          <label class="calc-label">Wastage / Allowance (%) <span class="text-red-500">*</span></label>
          <input v-model.number="form.wastage" type="number" min="0" max="30" step="0.5" placeholder="e.g. 8" class="calc-input" />
        </div>
        <div>
          <label class="calc-label">Quantity of Shirts <span class="text-red-500">*</span></label>
          <input v-model.number="form.qty" type="number" min="1" step="1" placeholder="e.g. 500" class="calc-input" />
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
          <div class="result-value">{{ result.metersPerPiece }}</div>
          <div class="result-label">Meters per Shirt</div>
        </div>
        <div class="result-box text-center">
          <div class="result-value">{{ result.metersWithWastage }}</div>
          <div class="result-label">With Wastage (m/pc)</div>
        </div>
      </div>
      <div class="bg-gray-50 border border-gray-200 rounded-xl p-3 text-center">
        <div class="text-2xl font-bold text-gray-700">{{ result.totalMeters }}</div>
        <div class="text-xs text-gray-500 mt-0.5">Total Fabric Required (meters) for {{ form.qty }} shirts</div>
      </div>
      <div class="formula-box mt-4">
        Net panel area = (Body: 2×(length+6)×(chest×2+8)) + (Sleeve: 2×(sleeve+6)×(width×2+6)) + collar + cuff (cm²)<br>
        Meters/piece = Net area / (fabric width × marker efficiency / 100) / 100<br>
        Total = Meters/piece × (1 + wastage%) × Qty
      </div>
    </div>

    <div v-if="error" class="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">{{ error }}</div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'

const form = reactive({
  bodyLength: null, chest: null, sleeveLength: null, sleeveWidth: null,
  collar: 8, cuff: 7, fabricWidth: null, markerEff: 85, wastage: 8, qty: 1,
})
const result = ref(null)
const error = ref('')

function calculate() {
  error.value = ''; result.value = null
  const { bodyLength, chest, sleeveLength, sleeveWidth, collar, cuff, fabricWidth, markerEff, wastage, qty } = form
  if (!bodyLength || !chest || !sleeveLength || !sleeveWidth) return (error.value = 'Enter all garment measurements.')
  if (!fabricWidth || fabricWidth <= 0) return (error.value = 'Enter a valid fabric width.')
  if (!markerEff || markerEff <= 0)     return (error.value = 'Enter a valid marker efficiency.')
  if (!qty || qty <= 0)                 return (error.value = 'Enter a valid quantity.')

  // All areas in cm²
  const bodyArea     = 2 * (bodyLength + 6) * (chest * 2 + 8)
  const sleeveArea   = 2 * (sleeveLength + 6) * (sleeveWidth * 2 + 6)
  const collarArea   = (collar || 0) * (chest + 4) * 2   // approximate collar fabric
  const cuffArea     = (cuff || 0) * 30 * 2              // approximate cuff: 2 cuffs × ~30cm length

  const totalArea    = bodyArea + sleeveArea + collarArea + cuffArea  // cm²
  const effectiveWidth = fabricWidth * (markerEff / 100)              // cm (effective usable width)
  const metersPerPiece = totalArea / (effectiveWidth * 100)           // convert cm² → meters (÷100 for cm→m)

  const metersWithWastage = metersPerPiece * (1 + wastage / 100)
  const totalMeters       = metersWithWastage * qty

  result.value = {
    metersPerPiece:     parseFloat(metersPerPiece.toFixed(3)),
    metersWithWastage:  parseFloat(metersWithWastage.toFixed(3)),
    totalMeters:        parseFloat(totalMeters.toFixed(2)),
  }
}

function reset() {
  Object.assign(form, { bodyLength: null, chest: null, sleeveLength: null, sleeveWidth: null, collar: 8, cuff: 7, fabricWidth: null, markerEff: 85, wastage: 8, qty: 1 })
  result.value = null; error.value = ''
}
</script>

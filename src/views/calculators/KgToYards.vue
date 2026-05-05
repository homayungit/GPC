<template>
  <div>
    <div class="mb-5">
      <h1 class="page-title">🔄 Knits: Kg → Yards Conversion</h1>
      <p class="page-subtitle">Convert knitted fabric weight (kg) to length in yards.</p>
    </div>

    <div class="section-card mb-4">
      <div class="space-y-4">
        <div>
          <label class="calc-label">Fabric Weight (kg) <span class="text-red-500">*</span></label>
          <input v-model.number="form.kg" type="number" min="0" step="0.001" placeholder="e.g. 250" class="calc-input" />
        </div>
        <div>
          <label class="calc-label">GSM (grams per square metre) <span class="text-red-500">*</span></label>
          <input v-model.number="form.gsm" type="number" min="0" step="1" placeholder="e.g. 180" class="calc-input" />
        </div>
        <div>
          <label class="calc-label">Fabric Width (cm) <span class="text-red-500">*</span></label>
          <input v-model.number="form.width" type="number" min="0" step="1" placeholder="e.g. 160" class="calc-input" />
          <p class="text-xs text-gray-400 mt-1">Enter fabric width in centimeters</p>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-3 mt-5">
        <button @click="calculate" class="calc-btn">Convert</button>
        <button @click="reset" class="calc-btn-secondary">Reset</button>
      </div>
    </div>

    <div v-if="result !== null" class="section-card">
      <h2 class="text-sm font-bold text-gray-600 uppercase tracking-wide mb-3">Results</h2>
      <div class="result-box text-center mb-3">
        <div class="result-value">{{ result.yards }} yds</div>
        <div class="result-label">Fabric Length in Yards</div>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div class="bg-gray-50 border border-gray-200 rounded-xl p-3 text-center">
          <div class="text-xl font-bold text-gray-700">{{ result.meters }} m</div>
          <div class="text-xs text-gray-500 mt-0.5">Meters</div>
        </div>
        <div class="bg-gray-50 border border-gray-200 rounded-xl p-3 text-center">
          <div class="text-xl font-bold text-gray-700">{{ result.sqMeters }}</div>
          <div class="text-xs text-gray-500 mt-0.5">Square Meters (m²)</div>
        </div>
      </div>
      <div class="formula-box mt-4">
        Step 1: Meters = (kg × 1,000 × 100) / (GSM × Width_cm)<br>
        Step 2: Yards = Meters × 1.09361<br>
        (1 meter = 1.09361 yards)
      </div>
    </div>

    <div v-if="error" class="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">{{ error }}</div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'

const form = reactive({ kg: null, gsm: null, width: null })
const result = ref(null)
const error = ref('')

function calculate() {
  error.value = ''; result.value = null
  const { kg, gsm, width } = form
  if (!kg || kg <= 0)       return (error.value = 'Enter a valid weight in kg.')
  if (!gsm || gsm <= 0)     return (error.value = 'Enter a valid GSM.')
  if (!width || width <= 0) return (error.value = 'Enter a valid fabric width in cm.')

  const meters   = (kg * 1000 * 100) / (gsm * width)
  const yards    = meters * 1.09361
  const sqMeters = meters * (width / 100)

  result.value = {
    meters:   parseFloat(meters.toFixed(3)),
    yards:    parseFloat(yards.toFixed(3)),
    sqMeters: parseFloat(sqMeters.toFixed(3)),
  }
}

function reset() {
  form.kg = null; form.gsm = null; form.width = null
  result.value = null; error.value = ''
}
</script>

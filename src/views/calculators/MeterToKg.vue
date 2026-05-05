<template>
  <div>
    <div class="mb-5">
      <h1 class="page-title">📏 Knits: Meter → Kg Conversion</h1>
      <p class="page-subtitle">Convert knitted fabric length (meters) to weight (kg).</p>
    </div>

    <div class="section-card mb-4">
      <div class="space-y-4">
        <div>
          <label class="calc-label">Fabric Length (meters) <span class="text-red-500">*</span></label>
          <input v-model.number="form.meters" type="number" min="0" step="0.001" placeholder="e.g. 500" class="calc-input" />
        </div>
        <div>
          <label class="calc-label">GSM (grams per square metre) <span class="text-red-500">*</span></label>
          <input v-model.number="form.gsm" type="number" min="0" step="1" placeholder="e.g. 180" class="calc-input" />
        </div>
        <div>
          <label class="calc-label">Fabric Width (cm) <span class="text-red-500">*</span></label>
          <input v-model.number="form.width" type="number" min="0" step="1" placeholder="e.g. 160" class="calc-input" />
          <p class="text-xs text-gray-400 mt-1">Open-width in cm (e.g., 180 cm = 72")</p>
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
        <div class="result-value">{{ result.kg }} kg</div>
        <div class="result-label">Fabric Weight in Kilograms</div>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div class="bg-gray-50 border border-gray-200 rounded-xl p-3 text-center">
          <div class="text-xl font-bold text-gray-700">{{ result.grams }}</div>
          <div class="text-xs text-gray-500 mt-0.5">Grams (g)</div>
        </div>
        <div class="bg-gray-50 border border-gray-200 rounded-xl p-3 text-center">
          <div class="text-xl font-bold text-gray-700">{{ result.sqMeters }}</div>
          <div class="text-xs text-gray-500 mt-0.5">Square Meters (m²)</div>
        </div>
      </div>
      <div class="formula-box mt-4">
        Kg = (Meters × GSM × Width_cm) / (100 × 1,000)<br>
        Kg = (Meters × GSM × Width_cm) / 100,000
      </div>
    </div>

    <div v-if="error" class="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">{{ error }}</div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'

const form = reactive({ meters: null, gsm: null, width: null })
const result = ref(null)
const error = ref('')

function calculate() {
  error.value = ''; result.value = null
  const { meters, gsm, width } = form
  if (!meters || meters <= 0) return (error.value = 'Enter a valid length in meters.')
  if (!gsm || gsm <= 0)       return (error.value = 'Enter a valid GSM.')
  if (!width || width <= 0)   return (error.value = 'Enter a valid fabric width in cm.')

  const sqMeters = meters * (width / 100)
  const grams    = sqMeters * gsm
  const kg       = grams / 1000

  result.value = {
    sqMeters: parseFloat(sqMeters.toFixed(3)),
    grams:    parseFloat(grams.toFixed(2)),
    kg:       parseFloat(kg.toFixed(3)),
  }
}

function reset() {
  form.meters = null; form.gsm = null; form.width = null
  result.value = null; error.value = ''
}
</script>

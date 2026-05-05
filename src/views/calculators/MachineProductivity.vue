<template>
  <div>
    <div class="mb-5">
      <h1 class="page-title">🔧 Machine Productivity Calculator</h1>
      <p class="page-subtitle">Measure output per machine to evaluate machinery utilization.</p>
    </div>

    <div class="section-card mb-4">
      <div class="space-y-4">
        <div>
          <label class="calc-label">Total Output (pieces) <span class="text-red-500">*</span></label>
          <input v-model.number="form.output" type="number" min="0" step="1" placeholder="e.g. 3000" class="calc-input" />
        </div>
        <div>
          <label class="calc-label">Number of Machines <span class="text-red-500">*</span></label>
          <input v-model.number="form.machines" type="number" min="1" step="1" placeholder="e.g. 25" class="calc-input" />
        </div>
        <div>
          <label class="calc-label">Working Hours per Day <span class="text-red-500">*</span></label>
          <input v-model.number="form.hours" type="number" min="0" step="0.5" placeholder="e.g. 8" class="calc-input" />
        </div>
        <div>
          <label class="calc-label">Working Days (optional)</label>
          <input v-model.number="form.days" type="number" min="1" step="1" placeholder="e.g. 26" class="calc-input" />
        </div>
      </div>
      <div class="grid grid-cols-2 gap-3 mt-5">
        <button @click="calculate" class="calc-btn">Calculate</button>
        <button @click="reset" class="calc-btn-secondary">Reset</button>
      </div>
    </div>

    <div v-if="result !== null" class="section-card">
      <h2 class="text-sm font-bold text-gray-600 uppercase tracking-wide mb-3">Results</h2>
      <div class="result-box text-center mb-3">
        <div class="result-value">{{ result.perMachinePerHour }}</div>
        <div class="result-label">Pieces per Machine per Hour</div>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div class="bg-gray-50 border border-gray-200 rounded-xl p-3 text-center">
          <div class="text-xl font-bold text-gray-700">{{ result.perMachinePerDay }}</div>
          <div class="text-xs text-gray-500 mt-0.5">Pieces / Machine / Day</div>
        </div>
        <div v-if="result.perMachineTotal !== null" class="bg-gray-50 border border-gray-200 rounded-xl p-3 text-center">
          <div class="text-xl font-bold text-gray-700">{{ result.perMachineTotal }}</div>
          <div class="text-xs text-gray-500 mt-0.5">Pieces / Machine (total)</div>
        </div>
      </div>
      <div class="formula-box mt-4">
        Per Machine / Hour = Total Output / (Machines × Hours × Days)<br>
        Per Machine / Day = Per Machine / Hour × Hours
      </div>
    </div>

    <div v-if="error" class="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">{{ error }}</div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'

const form = reactive({ output: null, machines: null, hours: 8, days: null })
const result = ref(null)
const error = ref('')

function calculate() {
  error.value = ''; result.value = null
  const { output, machines, hours, days } = form
  if (!output || output < 0)    return (error.value = 'Enter valid total output.')
  if (!machines || machines <= 0) return (error.value = 'Enter a valid number of machines.')
  if (!hours || hours <= 0)       return (error.value = 'Enter valid working hours.')

  const effectiveDays      = days > 0 ? days : 1
  const perMachinePerHour  = output / (machines * hours * effectiveDays)
  const perMachinePerDay   = perMachinePerHour * hours
  const perMachineTotal    = days > 0 ? parseFloat((output / machines).toFixed(2)) : null

  result.value = {
    perMachinePerHour: parseFloat(perMachinePerHour.toFixed(2)),
    perMachinePerDay:  parseFloat(perMachinePerDay.toFixed(2)),
    perMachineTotal,
  }
}

function reset() {
  form.output = null; form.machines = null; form.hours = 8; form.days = null
  result.value = null; error.value = ''
}
</script>

<template>
  <div>
    <div class="mb-5">
      <h1 class="page-title">🔍 Quality DHU Calculator</h1>
      <p class="page-subtitle">DHU (Defects per Hundred Units) measures the quality level of production output.</p>
    </div>

    <div class="section-card mb-4">
      <div class="space-y-4">
        <div>
          <label class="calc-label">Total Pieces Checked (inspected) <span class="text-red-500">*</span></label>
          <input v-model.number="form.checked" type="number" min="1" step="1" placeholder="e.g. 200" class="calc-input" />
        </div>
        <div>
          <label class="calc-label">Total Defects Found <span class="text-red-500">*</span></label>
          <input v-model.number="form.defects" type="number" min="0" step="1" placeholder="e.g. 18" class="calc-input" />
          <p class="text-xs text-gray-400 mt-1">Count each defect (a garment may have multiple defects).</p>
        </div>
        <div>
          <label class="calc-label">Defective Pieces (optional — for rejection rate)</label>
          <input v-model.number="form.defectivePieces" type="number" min="0" step="1" placeholder="e.g. 14" class="calc-input" />
        </div>
      </div>
      <div class="grid grid-cols-2 gap-3 mt-5">
        <button @click="calculate" class="calc-btn">Calculate DHU</button>
        <button @click="reset" class="calc-btn-secondary">Reset</button>
      </div>
    </div>

    <div v-if="result !== null" class="section-card">
      <h2 class="text-sm font-bold text-gray-600 uppercase tracking-wide mb-3">Results</h2>
      <div class="result-box text-center mb-3">
        <div class="result-value" :class="result.dhu <= 2 ? 'text-primary-700' : result.dhu <= 5 ? 'text-yellow-600' : 'text-red-600'">
          {{ result.dhu }}
        </div>
        <div class="result-label">DHU (Defects per Hundred Units)</div>
      </div>
      <div class="grid grid-cols-2 gap-3 mb-3">
        <div class="bg-gray-50 border border-gray-200 rounded-xl p-3 text-center">
          <div class="text-xl font-bold text-gray-700">{{ result.defectsPerPiece }}</div>
          <div class="text-xs text-gray-500 mt-0.5">Avg Defects / Piece</div>
        </div>
        <div v-if="result.rejectionRate !== null" class="bg-gray-50 border border-gray-200 rounded-xl p-3 text-center">
          <div class="text-xl font-bold text-gray-700">{{ result.rejectionRate }}%</div>
          <div class="text-xs text-gray-500 mt-0.5">Rejection Rate</div>
        </div>
      </div>

      <!-- Quality rating -->
      <div class="rounded-xl p-3 text-center text-sm font-semibold"
        :class="result.dhu <= 2 ? 'bg-primary-50 text-primary-700 border border-primary-200'
               : result.dhu <= 5 ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
               : 'bg-red-50 text-red-700 border border-red-200'">
        {{ result.dhu <= 2 ? '✅ Excellent Quality (DHU ≤ 2)' : result.dhu <= 5 ? '⚠️ Acceptable (DHU 2–5)' : '❌ Poor Quality (DHU > 5) — Action Required' }}
      </div>

      <div class="formula-box mt-3">
        DHU = (Total Defects / Total Pieces Inspected) × 100<br>
        Rejection Rate = (Defective Pieces / Total Inspected) × 100
      </div>
    </div>

    <div v-if="error" class="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">{{ error }}</div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'

const form = reactive({ checked: null, defects: null, defectivePieces: null })
const result = ref(null)
const error = ref('')

function calculate() {
  error.value = ''; result.value = null
  const { checked, defects, defectivePieces } = form
  if (!checked || checked <= 0) return (error.value = 'Enter the number of pieces checked.')
  if (defects == null || defects < 0) return (error.value = 'Enter the total defects found.')

  const dhu              = (defects / checked) * 100
  const defectsPerPiece  = defects / checked
  const rejectionRate    = (defectivePieces > 0) ? (defectivePieces / checked) * 100 : null

  result.value = {
    dhu:             parseFloat(dhu.toFixed(2)),
    defectsPerPiece: parseFloat(defectsPerPiece.toFixed(3)),
    rejectionRate:   rejectionRate !== null ? parseFloat(rejectionRate.toFixed(2)) : null,
  }
}

function reset() {
  form.checked = null; form.defects = null; form.defectivePieces = null
  result.value = null; error.value = ''
}
</script>

<template>
  <div class="flex flex-col gap-3 flex-1 min-h-0">

    <!-- ── Compact Hero ── -->
    <div class="relative overflow-hidden rounded-xl text-white shadow-lg flex-shrink-0
                bg-gradient-to-r from-primary-800 via-primary-700 to-primary-600
                dark:from-slate-800 dark:via-primary-900 dark:to-primary-900">
      <div class="absolute inset-0 pointer-events-none overflow-hidden">
        <div class="absolute -top-8 right-0 w-64 h-64 rounded-full bg-white/5 translate-x-16"></div>
        <div class="absolute top-0 right-1/4 w-px h-full bg-white/5"></div>
      </div>
      <div class="relative z-10 flex items-center justify-between gap-4 px-5 py-3.5 flex-wrap">
        <div class="min-w-0">
          <div class="flex items-center gap-2 mb-1">
            <span class="inline-flex items-center gap-1 bg-white/20 text-[9px] font-bold tracking-widest
                         uppercase px-2 py-0.5 rounded-full border border-white/10">
              🏭 Garment Industry Toolkit
            </span>
          </div>
          <h1 class="text-lg font-bold leading-tight truncate">{{ t('home.title') }}</h1>
          <p class="text-primary-200/80 text-[11px] mt-0.5 hidden sm:block">{{ t('home.tagline') }}</p>
        </div>
        <!-- Stats -->
        <div class="flex items-center gap-2 flex-shrink-0">
          <div v-for="stat in heroStats" :key="stat.label"
            class="flex items-center gap-1.5 bg-white/15 rounded-lg px-2.5 py-2
                   border border-white/10 backdrop-blur-sm">
            <span class="text-base leading-none">{{ stat.icon }}</span>
            <div>
              <div class="text-sm font-bold leading-none">{{ stat.value }}</div>
              <div class="text-[9px] text-primary-200/80 leading-none mt-0.5">{{ stat.label }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── 2×2 Section Grid ── -->
    <div class="grid grid-cols-1 lg:grid-cols-2 auto-rows-fr gap-3 flex-1 min-h-0">
      <div v-for="group in groups" :key="group.tKey"
        class="bg-white dark:bg-slate-800/60 rounded-xl border border-gray-100
               dark:border-slate-700/60 shadow-sm flex flex-col overflow-hidden h-full">

        <!-- Category header -->
        <div class="flex items-center gap-2 px-3.5 py-2.5 border-b border-gray-100 dark:border-slate-700/60 flex-shrink-0"
          :class="group.headerStripe">
          <div class="w-7 h-7 rounded-lg flex items-center justify-center text-base flex-shrink-0"
            :class="group.iconBg">
            {{ group.icon }}
          </div>
          <h2 class="text-[12px] font-bold text-gray-700 dark:text-slate-200 uppercase tracking-wider flex-1">
            {{ t('nav.' + group.tKey) }}
          </h2>
          <span class="text-[10px] text-gray-400 dark:text-slate-500 hidden sm:block mr-2">{{ group.desc }}</span>
          <span class="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0" :class="group.badge">
            {{ group.items.length }}
          </span>
        </div>

        <!-- Cards grid — stretches rows to fill panel height when multiple items -->
        <div class="grid grid-cols-2 gap-2.5 p-3 min-h-0"
          :class="group.stretch ? 'flex-1 auto-rows-fr' : 'content-start'">

          <router-link v-for="item in group.items" :key="item.path" :to="item.path"
            class="group flex items-center gap-3
                   bg-gray-50 dark:bg-slate-700/50
                   border border-gray-100 dark:border-slate-600/40
                   hover:border-primary-200 dark:hover:border-primary-500/50
                   hover:bg-primary-50/60 dark:hover:bg-primary-900/20
                   rounded-xl px-3.5 py-3 transition-all duration-150 cursor-pointer overflow-hidden"
            :class="group.stretch ? 'h-full' : ''">

            <!-- Icon -->
            <div class="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center text-xl
                        bg-primary-600 dark:bg-primary-700 shadow-md
                        group-hover:scale-110 transition-transform duration-150">
              {{ t('calc.' + item.tKey + '.icon') }}
            </div>

            <!-- Text -->
            <div class="flex-1 min-w-0">
              <div class="text-[13px] font-semibold text-gray-700 dark:text-slate-200
                          group-hover:text-primary-700 dark:group-hover:text-primary-400
                          leading-tight truncate">
                {{ t('calc.' + item.tKey + '.title') }}
              </div>
              <div class="text-[11px] text-gray-400 dark:text-slate-500 truncate mt-0.5 leading-relaxed">
                {{ t('calc.' + item.tKey + '.desc') }}
              </div>
            </div>

            <svg class="w-3.5 h-3.5 text-gray-300 dark:text-slate-600 group-hover:text-primary-400
                        flex-shrink-0 transition-all duration-150 group-hover:translate-x-0.5"
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/>
            </svg>
          </router-link>
        </div>

      </div>
    </div>

    <p class="text-center text-[9px] text-gray-300 dark:text-slate-700 pb-1 flex-shrink-0">
      {{ t('home.footer') }}
    </p>
  </div>
</template>

<script setup>
import { useLang } from '../composables/useLang.js'
const { t } = useLang()

const heroStats = [
  { icon: '🧮', value: '16',   label: 'Calculators' },
  { icon: '📂', value: '4',    label: 'Categories'  },
  { icon: '⚡', value: 'Free', label: 'Always'      },
]

const groups = [
  {
    tKey: 'production', icon: '🏭', stretch: true,
    desc: 'Line output, OEE & capacity',
    headerStripe: 'bg-green-50/50 dark:bg-green-900/10',
    iconBg:  'bg-green-100 dark:bg-green-900/40',
    badge:   'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400',
    items: [
      { path: '/line-efficiency',     tKey: 'lineEff'  },
      { path: '/line-oee',            tKey: 'lineOEE'  },
      { path: '/production-capacity', tKey: 'prodCap'  },
      { path: '/line-sah',            tKey: 'lineSAH'  },
      { path: '/hourly-target',       tKey: 'hourly'   },
    ],
  },
  {
    tKey: 'efficiency', icon: '📊', stretch: true,
    desc: 'SAM, operator & labour metrics',
    headerStripe: 'bg-blue-50/50 dark:bg-blue-900/10',
    iconBg:  'bg-blue-100 dark:bg-blue-900/40',
    badge:   'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400',
    items: [
      { path: '/sam',                  tKey: 'sam'         },
      { path: '/emp-efficiency',       tKey: 'empEff'      },
      { path: '/emp-efficiency-multi', tKey: 'empEffMulti' },
      { path: '/labour-productivity',  tKey: 'labourProd'  },
      { path: '/machine-productivity', tKey: 'machineProd' },
    ],
  },
  {
    tKey: 'quality', icon: '✅', stretch: false,
    desc: 'Defect tracking & quality metrics',
    headerStripe: 'bg-teal-50/50 dark:bg-teal-900/10',
    iconBg:  'bg-teal-100 dark:bg-teal-900/40',
    badge:   'bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-400',
    items: [
      { path: '/dhu', tKey: 'dhu' },
    ],
  },
  {
    tKey: 'fabric', icon: '🧵', stretch: true,
    desc: 'Consumption & unit conversions',
    headerStripe: 'bg-orange-50/50 dark:bg-orange-900/10',
    iconBg:  'bg-orange-100 dark:bg-orange-900/40',
    badge:   'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-400',
    items: [
      { path: '/tshirt-fabric', tKey: 'tshirt'    },
      { path: '/woven-fabric',  tKey: 'woven'     },
      { path: '/kg-to-meter',   tKey: 'kgToMeter' },
      { path: '/meter-to-kg',   tKey: 'meterToKg' },
      { path: '/kg-to-yards',   tKey: 'kgToYards' },
    ],
  },
]
</script>

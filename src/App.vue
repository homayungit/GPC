<template>
  <div class="min-h-screen flex flex-col">

    <!-- ═══════════ HEADER ═══════════ -->
    <header class="fixed top-0 inset-x-0 z-40 h-13 flex items-center
                   bg-primary-700 dark:bg-slate-900 shadow-md border-b border-primary-800 dark:border-slate-700">
      <div class="flex items-center gap-2 px-3 h-full flex-1 min-w-0">
        <!-- Hamburger (mobile) -->
        <button @click="drawerOpen = true"
          class="md:hidden p-1.5 rounded-lg hover:bg-primary-600 dark:hover:bg-slate-700 transition-colors text-white">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
        <!-- Logo -->
        <router-link to="/" class="flex items-center gap-2 min-w-0">
          <div class="w-7 h-7 rounded-lg bg-white/20 dark:bg-white/10 flex items-center justify-center text-base flex-shrink-0">🧵</div>
          <div class="min-w-0 hidden sm:block">
            <span class="font-bold text-white text-sm leading-none">{{ t('app.name') }}</span>
            <span class="text-primary-200 dark:text-slate-400 text-xs ml-1.5 hidden md:inline">{{ t('app.full') }}</span>
          </div>
          <span class="font-bold text-white text-sm sm:hidden">GPC</span>
        </router-link>
        <!-- Current page crumb (mobile, not home) -->
        <div v-if="$route.name !== 'Home'" class="md:hidden ml-2 text-xs text-primary-200 truncate max-w-[140px]">
          › {{ $route.meta.title }}
        </div>
      </div>

      <!-- Right controls -->
      <div class="flex items-center gap-1 px-3">
        <!-- Dark mode toggle -->
        <button @click="toggleDark()"
          class="p-1.5 rounded-lg hover:bg-primary-600 dark:hover:bg-slate-700 transition-colors text-primary-100 dark:text-slate-300"
          :title="dark ? 'Light mode' : 'Dark mode'">
          <svg v-if="dark" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"/>
          </svg>
          <svg v-else class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
          </svg>
        </button>
        <!-- Language toggle -->
        <button @click="toggleLang()"
          class="px-2 py-1 rounded-lg text-xs font-bold hover:bg-primary-600 dark:hover:bg-slate-700
                 transition-colors text-primary-100 dark:text-slate-300 border border-primary-500/50
                 dark:border-slate-600 min-w-[42px] text-center">
          {{ lang === 'en' ? 'বাং' : 'EN' }}
        </button>
      </div>
    </header>

    <!-- ═══════════ MOBILE OVERLAY ═══════════ -->
    <transition name="fade">
      <div v-if="drawerOpen" @click="drawerOpen = false"
        class="fixed inset-0 bg-black/60 z-50 md:hidden backdrop-blur-sm"/>
    </transition>

    <!-- ═══════════ MOBILE DRAWER ═══════════ -->
    <transition name="slide-drawer">
      <nav v-if="drawerOpen"
        class="fixed inset-y-0 left-0 w-72 z-50 md:hidden flex flex-col
               bg-white dark:bg-slate-950 shadow-2xl border-r border-gray-200 dark:border-slate-700/80">
        <!-- Drawer header -->
        <div class="flex items-center gap-3 px-4 py-3 bg-primary-700 dark:bg-slate-950 border-b border-primary-600 dark:border-slate-800">
          <div class="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-lg">🧵</div>
          <div class="flex-1 min-w-0">
            <div class="font-bold text-white text-sm">{{ t('app.name') }}</div>
            <div class="text-primary-200 dark:text-slate-400 text-xs truncate">{{ t('app.full') }}</div>
          </div>
          <button @click="drawerOpen = false" class="text-primary-200 dark:text-slate-400 hover:text-white p-1 rounded-lg">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <!-- Nav items -->
        <div class="flex-1 overflow-y-auto py-2">
          <router-link to="/" @click="drawerOpen = false"
            class="nav-item" :class="$route.name === 'Home' ? 'nav-item-active' : ''">
            <span class="nav-icon">🏠</span>
            <span>{{ t('nav.allCalcs') }}</span>
          </router-link>
          <template v-for="group in navGroups" :key="group.key">
            <div class="nav-group-label">
              <span class="w-1.5 h-1.5 rounded-full flex-shrink-0" :class="group.dot"></span>
              {{ t('nav.' + group.key) }}
            </div>
            <router-link v-for="item in group.items" :key="item.path"
              :to="item.path" @click="drawerOpen = false"
              class="nav-item" :class="$route.path === item.path ? 'nav-item-active' : ''">
              <span class="nav-icon">{{ item.icon }}</span>
              <span class="leading-tight">{{ t('calc.' + item.tKey + '.title') }}</span>
            </router-link>
          </template>
        </div>
        <div class="p-3 border-t border-gray-100 dark:border-slate-800 text-[10px] text-gray-400 dark:text-slate-600 text-center">
          {{ t('app.suite') }}
        </div>
      </nav>
    </transition>

    <!-- ═══════════ BODY ═══════════ -->
    <div class="flex flex-1 pt-13 pb-16 md:pb-0">

      <!-- ── DESKTOP SIDEBAR ── -->
      <aside class="hidden md:flex flex-col fixed top-13 left-0 bottom-0 w-52
                    bg-white dark:bg-slate-950 border-r border-gray-200 dark:border-slate-700/80
                    shadow-sm dark:shadow-none overflow-y-auto z-30">
        <nav class="py-2 flex-1">
          <router-link to="/"
            class="nav-item" :class="$route.name === 'Home' ? 'nav-item-active' : ''">
            <span class="nav-icon">🏠</span>
            <span>{{ t('nav.allCalcs') }}</span>
          </router-link>
          <template v-for="group in navGroups" :key="group.key">
            <div class="nav-group-label">
              <span class="w-1.5 h-1.5 rounded-full flex-shrink-0" :class="group.dot"></span>
              {{ t('nav.' + group.key) }}
            </div>
            <router-link v-for="item in group.items" :key="item.path" :to="item.path"
              class="nav-item" :class="$route.path === item.path ? 'nav-item-active' : ''">
              <span class="nav-icon">{{ item.icon }}</span>
              <span class="leading-tight">{{ t('calc.' + item.tKey + '.title') }}</span>
            </router-link>
          </template>
        </nav>
        <div class="p-3 border-t border-gray-100 dark:border-slate-800 text-[9px] text-gray-400 dark:text-slate-600 text-center">
          {{ t('app.suite') }}
        </div>
      </aside>

      <!-- ── MAIN CONTENT ── -->
      <main class="flex flex-col flex-1 md:ml-52 min-h-full">
        <div class="flex flex-col flex-1 px-4 py-4">
          <router-view />
        </div>
      </main>
    </div>

    <!-- ═══════════ MOBILE BOTTOM NAV ═══════════ -->
    <nav class="md:hidden fixed bottom-0 inset-x-0 z-40 h-16 flex items-stretch
                bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 shadow-lg">
      <router-link to="/"
        class="bottom-tab" :class="$route.name === 'Home' ? 'bottom-tab-active' : ''">
        <span class="text-lg leading-none">🏠</span>
        <span>{{ t('nav.home') }}</span>
      </router-link>
      <button @click="goToCategory('production')"
        class="bottom-tab" :class="$route.meta.category === 'production' ? 'bottom-tab-active' : ''">
        <span class="text-lg leading-none">🏭</span>
        <span>{{ t('nav.production') }}</span>
      </button>
      <button @click="goToCategory('efficiency')"
        class="bottom-tab" :class="$route.meta.category === 'efficiency' ? 'bottom-tab-active' : ''">
        <span class="text-lg leading-none">📊</span>
        <span>{{ t('nav.efficiency') }}</span>
      </button>
      <button @click="goToCategory('quality')"
        class="bottom-tab" :class="$route.meta.category === 'quality' ? 'bottom-tab-active' : ''">
        <span class="text-lg leading-none">✅</span>
        <span>{{ t('nav.quality') }}</span>
      </button>
      <button @click="goToCategory('fabric')"
        class="bottom-tab" :class="$route.meta.category === 'fabric' ? 'bottom-tab-active' : ''">
        <span class="text-lg leading-none">🧵</span>
        <span>{{ t('nav.fabric') }}</span>
      </button>
    </nav>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useTheme } from './composables/useTheme.js'
import { useLang } from './composables/useLang.js'

const { dark, toggleDark } = useTheme()
const { lang, t, toggleLang } = useLang()
const drawerOpen = ref(false)
const router = useRouter()

const navGroups = [
  {
    key: 'production', dot: 'bg-green-500',
    items: [
      { path: '/line-efficiency',     icon: '📈', tKey: 'lineEff'    },
      { path: '/line-oee',            icon: '⚙️', tKey: 'lineOEE'   },
      { path: '/production-capacity', icon: '🏭', tKey: 'prodCap'   },
      { path: '/line-sah',            icon: '⏱️', tKey: 'lineSAH'   },
      { path: '/hourly-target',       icon: '🎯', tKey: 'hourly'    },
    ],
  },
  {
    key: 'efficiency', dot: 'bg-blue-500',
    items: [
      { path: '/sam',                  icon: '📐', tKey: 'sam'         },
      { path: '/emp-efficiency',       icon: '👤', tKey: 'empEff'      },
      { path: '/emp-efficiency-multi', icon: '👥', tKey: 'empEffMulti' },
      { path: '/labour-productivity',  icon: '💪', tKey: 'labourProd'  },
      { path: '/machine-productivity', icon: '🔧', tKey: 'machineProd' },
    ],
  },
  {
    key: 'quality', dot: 'bg-teal-500',
    items: [
      { path: '/dhu', icon: '🔍', tKey: 'dhu' },
    ],
  },
  {
    key: 'fabric', dot: 'bg-orange-500',
    items: [
      { path: '/tshirt-fabric', icon: '👕', tKey: 'tshirt'    },
      { path: '/woven-fabric',  icon: '👔', tKey: 'woven'     },
      { path: '/kg-to-meter',   icon: '⚖️', tKey: 'kgToMeter' },
      { path: '/meter-to-kg',   icon: '📏', tKey: 'meterToKg' },
      { path: '/kg-to-yards',   icon: '🔄', tKey: 'kgToYards' },
    ],
  },
]

function goToCategory(cat) {
  const all = navGroups.flatMap(g => g.items)
  const first = all.find(i => {
    const r = router.resolve(i.path)
    return r.meta?.category === cat
  })
  if (first) router.push(first.path)
}
</script>

<style>
/* Header height */
.pt-13 { padding-top: 3.25rem; }
.top-13 { top: 3.25rem; }
.h-13  { height: 3.25rem; }

/* Nav items */
.nav-item {
  @apply flex items-center gap-2 mx-2 px-2.5 py-1.5 rounded-lg text-[12px] text-gray-600
         dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800/80
         hover:text-gray-900 dark:hover:text-slate-100 transition-colors cursor-pointer;
}
.nav-item-active {
  @apply bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400
         font-semibold border-r-2 border-primary-600 dark:border-primary-500 !important;
}
.nav-icon { @apply text-sm w-4 flex-shrink-0 text-center; }
.nav-group-label {
  @apply flex items-center gap-1.5 px-4 pt-3 pb-0.5 text-[9px] font-bold
         text-gray-400 dark:text-slate-500 uppercase tracking-widest;
}

/* Bottom tabs */
.bottom-tab {
  @apply flex-1 flex flex-col items-center justify-center gap-0.5
         text-[10px] font-medium text-gray-400 dark:text-slate-500
         hover:text-gray-600 dark:hover:text-slate-300 transition-colors;
}
.bottom-tab-active { @apply text-primary-600 dark:text-primary-400 !important; }

/* Transitions */
.fade-enter-active, .fade-leave-active { transition: opacity .2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.slide-drawer-enter-active, .slide-drawer-leave-active { transition: transform .25s ease; }
.slide-drawer-enter-from, .slide-drawer-leave-to { transform: translateX(-100%); }
</style>

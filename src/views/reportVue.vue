<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <header class="mb-10 text-center">
        <h1 class="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
          File a New Disaster Report
        </h1>
        <p class="text-gray-600 max-w-2xl mx-auto">
          Provide accurate information to enable rapid response and effective aid distribution.
          <span class="text-red-500">* Required fields</span>
        </p>
      </header>

      <!-- Progress Indicator -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-gray-700">Form Progress</span>
          <span class="text-sm font-medium text-blue-600">{{ calculateProgress() }}% Complete</span>
        </div>
        <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            class="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
            :style="{ width: calculateProgress() + '%' }"
          ></div>
        </div>
      </div>

      <form @submit.prevent="submitForm" class="space-y-8">
        <!-- Section 1: Disaster Details -->
        <section class="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <div class="flex items-center mb-6">
            <div
              class="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4"
            >
              <span class="text-blue-600 font-bold">1</span>
            </div>
            <h2 class="text-xl font-bold text-gray-800">Disaster Details</h2>
          </div>

          <div class="space-y-6">
            <!-- Disaster Type -->
            <div>
              <label class="block text-gray-700 font-medium mb-2">
                Type of Disaster <span class="text-red-500">*</span>
              </label>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button
                  v-for="type in disasterTypes"
                  :key="type.value"
                  type="button"
                  @click="disasterType = type.value"
                  :class="[
                    'p-4 rounded-xl border-2 transition-all duration-200',
                    disasterType === type.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300',
                  ]"
                >
                  <div class="text-center">
                    <div class="text-2xl mb-2">{{ type.emoji }}</div>
                    <p class="font-medium">{{ type.label }}</p>
                  </div>
                </button>
              </div>
              <p v-if="disasterTypeError" class="mt-2 text-sm text-red-600">
                {{ disasterTypeError }}
              </p>
            </div>

            <!-- Location -->
            <div>
              <label class="block text-gray-700 font-medium mb-2">
                GPS Location <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <input
                  type="text"
                  v-model="location"
                  readonly
                  class="w-full px-4 py-3 pl-12 rounded-lg border border-gray-300 bg-gray-50 cursor-not-allowed"
                  :placeholder="
                    locationLoading ? 'Getting location...' : 'Click button to get location'
                  "
                />
                <div class="absolute left-4 top-3.5">
                  <svg
                    class="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <button
                  type="button"
                  @click="getCurrentLocation"
                  :disabled="locationLoading"
                  class="absolute right-3 top-3 text-[10px] sm:text-sm text-blue-600 hover:text-blue-800 font-medium disabled:opacity-50 disabled:cursor-not-allowed truncate"
                >
                  {{ locationLoading ? 'Getting Location...' : 'Get Current Location' }}
                </button>
              </div>
              <p v-if="locationError" class="mt-2 text-sm text-red-600">{{ locationError }}</p>
            </div>
          </div>
        </section>

        <!-- Section 2: Impact Assessment -->
        <section class="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <div class="flex items-center mb-6">
            <div
              class="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-4"
            >
              <span class="text-red-600 font-bold">2</span>
            </div>
            <h2 class="text-xl font-bold text-gray-800">Impact Assessment</h2>
            <p class="text-sm text-gray-500 ml-4">
              (At least one impact category must be reported)
            </p>
          </div>

          <div class="space-y-8">
            <!-- Home Category -->
            <div class="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div class="flex items-center justify-between mb-4">
                <h3 class="font-bold text-gray-800 text-lg flex items-center">
                  <svg
                    class="w-6 h-6 mr-2 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  Home Impact
                </h3>
                <label class="flex items-center cursor-pointer">
                  <div class="relative">
                    <input type="checkbox" v-model="isHomeImpacted" class="sr-only" />
                    <div
                      class="w-10 h-6 bg-gray-200 rounded-full shadow-inner transition-colors"
                      :class="isHomeImpacted ? 'bg-blue-600' : 'bg-gray-300'"
                    ></div>
                    <div
                      class="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform transform"
                      :class="isHomeImpacted ? 'translate-x-4' : ''"
                    ></div>
                  </div>
                  <span class="ml-3 font-medium">Home Affected</span>
                </label>
              </div>

              <div v-if="isHomeImpacted" class="mt-6">
                <div class="mb-6">
                  <label class="block text-gray-700 font-medium mb-4">
                    Home Damage Level <span class="text-red-500">*</span>
                  </label>
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                      v-for="level in damageLevels"
                      :key="level.value"
                      type="button"
                      @click="homeDamageLevel = level.value"
                      :class="[
                        'p-4 rounded-lg border-2 transition-all',
                        homeDamageLevel === level.value
                          ? level.selectedClass
                          : 'border-gray-200 hover:border-blue-300',
                      ]"
                    >
                      <div class="text-center">
                        <div class="text-2xl mb-2">{{ level.emoji }}</div>
                        <p class="font-medium">{{ level.label }}</p>
                        <p class="text-sm text-gray-500 mt-1">{{ level.description }}</p>
                      </div>
                    </button>
                  </div>
                </div>

                <!-- Home Images Upload (for ALL damage levels) -->
                <div v-if="isHomeImpacted && homeDamageLevel" class="mt-6">
                  <div class="mb-4">
                    <label class="block text-gray-700 font-medium mb-4">
                      Upload Evidence of Home Damage
                      <span class="text-red-500">*</span>
                    </label>
                    <p class="text-sm text-gray-600 mb-4">
                      Please provide a clear photo showing the
                      {{ getDamageLevelLabel(homeDamageLevel) }}. Maximum 1 photo allowed.
                    </p>
                  </div>

                  <!-- Upload Area - Show if no image uploaded -->
                  <div
                    v-if="homeImages.length === 0"
                    class="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-blue-400 transition-colors cursor-pointer"
                    @click="triggerHomeUpload"
                  >
                    <input
                      type="file"
                      ref="homeImagesInput"
                      accept="image/*"
                      class="hidden"
                      @change="handleHomeImages"
                    />
                    <div>
                      <div
                        class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"
                      >
                        <svg
                          class="w-8 h-8 text-red-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                          />
                        </svg>
                      </div>
                      <p class="font-medium text-gray-700 mb-2">
                        Click to upload home damage evidence
                      </p>
                      <p class="text-sm text-gray-500">Only 1 photo required</p>
                    </div>
                  </div>

                  <!-- Image Preview - Show if image uploaded -->
                  <div v-else class="mt-4">
                    <h4 class="font-medium text-gray-700 mb-3">Home Evidence</h4>
                    <div class="flex items-start gap-4">
                      <div class="relative group">
                        <div class="w-48 h-48 rounded-lg overflow-hidden bg-gray-100">
                          <img
                            :src="homeImages[0].preview"
                            :alt="homeImages[0].name"
                            class="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          @click="removeHomeImage(0)"
                          class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-100 group-hover:opacity-100 transition-opacity"
                        >
                          <svg
                            class="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                      <div class="flex-1">
                        <p class="text-sm font-medium text-gray-700 mb-1">
                          {{ homeImages[0].name }}
                        </p>
                        <p class="text-sm text-gray-500 mb-3">
                          {{ formatFileSize(homeImages[0].size) }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Shop Category -->
            <div class="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div class="flex items-center justify-between mb-4">
                <h3 class="font-bold text-gray-800 text-lg flex items-center">
                  <svg
                    class="w-6 h-6 mr-2 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  Shop/Business Impact
                </h3>
                <label class="flex items-center cursor-pointer">
                  <div class="relative">
                    <input type="checkbox" v-model="isShopImpacted" class="sr-only" />
                    <div
                      class="w-10 h-6 bg-gray-200 rounded-full shadow-inner transition-colors"
                      :class="isShopImpacted ? 'bg-blue-600' : 'bg-gray-300'"
                    ></div>
                    <div
                      class="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform transform"
                      :class="isShopImpacted ? 'translate-x-4' : ''"
                    ></div>
                  </div>
                  <span class="ml-3 font-medium">Shop Affected</span>
                </label>
              </div>

              <div v-if="isShopImpacted" class="mt-6">
                <div class="mb-6">
                  <label class="block text-gray-700 font-medium mb-4">
                    Shop Damage Level <span class="text-red-500">*</span>
                  </label>
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                      v-for="level in damageLevels"
                      :key="level.value"
                      type="button"
                      @click="shopDamageLevel = level.value"
                      :class="[
                        'p-4 rounded-lg border-2 transition-all',
                        shopDamageLevel === level.value
                          ? level.selectedClass
                          : 'border-gray-200 hover:border-blue-300',
                      ]"
                    >
                      <div class="text-center">
                        <div class="text-2xl mb-2">{{ level.emoji }}</div>
                        <p class="font-medium">{{ level.label }}</p>
                        <p class="text-sm text-gray-500 mt-1">{{ level.description }}</p>
                      </div>
                    </button>
                  </div>
                </div>

                <!-- Shop Images Upload (for ALL damage levels) -->
                <div v-if="isShopImpacted && shopDamageLevel" class="mt-6">
                  <div class="mb-4">
                    <label class="block text-gray-700 font-medium mb-4">
                      Upload Evidence of Shop Damage
                      <span class="text-red-500">*</span>
                    </label>
                    <p class="text-sm text-gray-600 mb-4">
                      Please provide a clear photo showing the
                      {{ getDamageLevelLabel(shopDamageLevel) }}. Maximum 1 photo allowed.
                    </p>
                  </div>

                  <!-- Upload Area - Show if no image uploaded -->
                  <div
                    v-if="shopImages.length === 0"
                    class="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-blue-400 transition-colors cursor-pointer"
                    @click="triggerShopUpload"
                  >
                    <input
                      type="file"
                      ref="shopImagesInput"
                      accept="image/*"
                      class="hidden"
                      @change="handleShopImages"
                    />
                    <div>
                      <div
                        class="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4"
                      >
                        <svg
                          class="w-8 h-8 text-orange-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                          />
                        </svg>
                      </div>
                      <p class="font-medium text-gray-700 mb-2">
                        Click to upload shop damage evidence
                      </p>
                      <p class="text-sm text-gray-500">Only 1 photo required</p>
                    </div>
                  </div>

                  <!-- Image Preview - Show if image uploaded -->
                  <div v-else class="mt-4">
                    <h4 class="font-medium text-gray-700 mb-3">Shop Evidence</h4>
                    <div class="flex items-start gap-4">
                      <div class="relative group">
                        <div class="w-48 h-48 rounded-lg overflow-hidden bg-gray-100">
                          <img
                            :src="shopImages[0].preview"
                            :alt="shopImages[0].name"
                            class="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          @click="removeShopImage(0)"
                          class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-100 group-hover:opacity-100 transition-opacity"
                        >
                          <svg
                            class="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                      <div class="flex-1">
                        <p class="text-sm font-medium text-gray-700 mb-1">
                          {{ shopImages[0].name }}
                        </p>
                        <p class="text-sm text-gray-500 mb-3">
                          {{ formatFileSize(shopImages[0].size) }}
                        </p>
                        <!-- <button
                          type="button"
                          @click="triggerShopUpload"
                          class="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                        >
                          Replace Image
                        </button> -->
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Animals Impact Category -->
            <div class="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div class="flex items-center justify-between mb-4">
                <h3 class="font-bold text-gray-800 text-lg flex items-center">
                  <svg
                    class="w-6 h-6 mr-2 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  Animals Impact
                </h3>
                <label class="flex items-center cursor-pointer">
                  <div class="relative">
                    <input type="checkbox" v-model="areAnimalsImpacted" class="sr-only" />
                    <div
                      class="w-10 h-6 bg-gray-200 rounded-full shadow-inner transition-colors"
                      :class="areAnimalsImpacted ? 'bg-blue-600' : 'bg-gray-300'"
                    ></div>
                    <div
                      class="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform transform"
                      :class="areAnimalsImpacted ? 'translate-x-4' : ''"
                    ></div>
                  </div>
                  <span class="ml-3 font-medium">Animals Affected</span>
                </label>
              </div>

              <div v-if="areAnimalsImpacted" class="mt-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <!-- Small Animals -->
                  <div class="bg-white rounded-lg p-6 border border-gray-200">
                    <h4 class="font-bold text-gray-800 text-lg mb-4 flex items-center">
                      <svg
                        class="w-5 h-5 mr-2 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Small Animals
                    </h4>
                    <p class="text-sm text-gray-500 mb-4">
                      Chickens, goats, sheep, rabbits, birds, etc.
                    </p>
                    <div class="space-y-4">
                      <div>
                        <label class="block text-gray-700 font-medium mb-2">Deaths</label>
                        <div
                          class="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white"
                        >
                          <button
                            type="button"
                            @click="decrementAnimals('smallDeaths')"
                            class="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            :disabled="smallAnimalsDeathCount <= 0"
                          >
                            <svg
                              class="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M20 12H4"
                              />
                            </svg>
                          </button>
                          <input
                            type="number"
                            v-model="smallAnimalsDeathCount"
                            min="0"
                            class="w-full px-3 py-2 text-center border-0 focus:ring-0 bg-transparent"
                            @input="validateCount('smallAnimalsDeathCount', $event.target.value)"
                          />
                          <button
                            type="button"
                            @click="incrementAnimals('smallDeaths')"
                            class="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors"
                          >
                            <svg
                              class="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M12 4v16m8-8H4"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div>
                        <label class="block text-gray-700 font-medium mb-2">Injured</label>
                        <div
                          class="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white"
                        >
                          <button
                            type="button"
                            @click="decrementAnimals('smallInjured')"
                            class="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            :disabled="smallAnimalsInjuredCount <= 0"
                          >
                            <svg
                              class="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M20 12H4"
                              />
                            </svg>
                          </button>
                          <input
                            type="number"
                            v-model="smallAnimalsInjuredCount"
                            min="0"
                            class="w-full px-3 py-2 text-center border-0 focus:ring-0 bg-transparent"
                            @input="validateCount('smallAnimalsInjuredCount', $event.target.value)"
                          />
                          <button
                            type="button"
                            @click="incrementAnimals('smallInjured')"
                            class="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors"
                          >
                            <svg
                              class="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M12 4v16m8-8H4"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Big Animals -->
                  <div class="bg-white rounded-lg p-6 border border-gray-200">
                    <h4 class="font-bold text-gray-800 text-lg mb-4 flex items-center">
                      <svg
                        class="w-5 h-5 mr-2 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Big Animals
                    </h4>
                    <p class="text-sm text-gray-500 mb-4">
                      Cows, buffaloes, horses, camels, donkeys, etc.
                    </p>
                    <div class="space-y-4">
                      <div>
                        <label class="block text-gray-700 font-medium mb-2">Deaths</label>
                        <div
                          class="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white"
                        >
                          <button
                            type="button"
                            @click="decrementAnimals('bigDeaths')"
                            class="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            :disabled="bigAnimalsDeathCount <= 0"
                          >
                            <svg
                              class="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M20 12H4"
                              />
                            </svg>
                          </button>
                          <input
                            type="number"
                            v-model="bigAnimalsDeathCount"
                            min="0"
                            class="w-full px-3 py-2 text-center border-0 focus:ring-0 bg-transparent"
                            @input="validateCount('bigAnimalsDeathCount', $event.target.value)"
                          />
                          <button
                            type="button"
                            @click="incrementAnimals('bigDeaths')"
                            class="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors"
                          >
                            <svg
                              class="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M12 4v16m8-8H4"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div>
                        <label class="block text-gray-700 font-medium mb-2">Injured</label>
                        <div
                          class="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white"
                        >
                          <button
                            type="button"
                            @click="decrementAnimals('bigInjured')"
                            class="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            :disabled="bigAnimalsInjuredCount <= 0"
                          >
                            <svg
                              class="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M20 12H4"
                              />
                            </svg>
                          </button>
                          <input
                            type="number"
                            v-model="bigAnimalsInjuredCount"
                            min="0"
                            class="w-full px-3 py-2 text-center border-0 focus:ring-0 bg-transparent"
                            @input="validateCount('bigAnimalsInjuredCount', $event.target.value)"
                          />
                          <button
                            type="button"
                            @click="incrementAnimals('bigInjured')"
                            class="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors"
                          >
                            <svg
                              class="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M12 4v16m8-8H4"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Animal Impact Summary -->
                <div
                  v-if="areAnimalsImpacted && totalAnimalImpact > 0"
                  class="mt-6 bg-green-50 rounded-lg p-4"
                >
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="font-medium text-gray-800">Total Animal Impact</p>
                      <p class="text-sm text-gray-600">
                        Deaths: {{ totalAnimalDeaths }}, Injured: {{ totalAnimalInjured }}
                      </p>
                    </div>
                    <div class="text-right">
                      <p class="text-2xl font-bold text-green-600">{{ totalAnimalImpact }}</p>
                      <p class="text-sm text-gray-500">animals affected</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Family Information -->
            <div class="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 class="font-bold text-gray-800 text-lg flex items-center mb-6">
                <svg
                  class="w-6 h-6 mr-2 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                Family Information <span class="text-red-500">*</span>
              </h3>

              <div class="space-y-6">
                <!-- Total Residents (Required) -->
                <div class="mb-6">
                  <label class="block text-gray-700 font-medium mb-2">
                    Total Residents in Home <span class="text-red-500">*</span>
                  </label>
                  <p class="text-sm text-gray-500 mb-4">
                    Total number of people living in the affected home
                  </p>
                  <div
                    class="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white max-w-xs"
                  >
                    <button
                      type="button"
                      @click="decrement('totalResidentsCount')"
                      class="px-4 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      :disabled="totalResidentsCount <= 0"
                    >
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M20 12H4"
                        />
                      </svg>
                    </button>
                    <input
                      type="number"
                      v-model="totalResidentsCount"
                      min="0"
                      required
                      class="w-full px-4 py-3 text-center border-0 focus:ring-0 bg-transparent text-lg font-medium"
                      @input="validateCount('totalResidentsCount', $event.target.value)"
                    />
                    <button
                      type="button"
                      @click="increment('totalResidentsCount')"
                      class="px-4 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors"
                    >
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                <!-- Other Family Statistics -->
                <div>
                  <label class="block text-gray-700 font-medium mb-4">Family Statistics</label>
                  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div
                      v-for="field in familyFields"
                      :key="field.id"
                      class="bg-white rounded-lg p-4 border border-gray-200"
                    >
                      <label class="block text-sm font-medium text-gray-700 mb-2">{{
                        field.label
                      }}</label>
                      <div
                        class="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white"
                      >
                        <button
                          type="button"
                          @click="decrement(field.model)"
                          class="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          :disabled="field.value <= 0"
                        >
                          <svg
                            class="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M20 12H4"
                            />
                          </svg>
                        </button>
                        <input
                          type="number"
                          v-model="field.value"
                          min="0"
                          :max="
                            field.model === 'deathsCount' || field.model === 'injuredCount'
                              ? totalResidentsCount
                              : undefined
                          "
                          class="w-full px-3 py-2 text-center border-0 focus:ring-0 bg-transparent"
                          @input="validateCount(field.model, $event.target.value)"
                        />
                        <button
                          type="button"
                          @click="increment(field.model)"
                          class="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors"
                          :disabled="
                            field.model === 'deathsCount' && field.value >= totalResidentsCount
                          "
                        >
                          <svg
                            class="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                        </button>
                      </div>
                      <p v-if="field.hint" class="text-xs text-gray-500 mt-1">{{ field.hint }}</p>
                    </div>
                  </div>
                </div>

                <!-- Family Summary -->
                <div class="bg-blue-50 rounded-lg p-4 mt-4">
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="font-medium text-gray-800">Family Impact Summary</p>
                      <p class="text-sm text-gray-600">
                        Residents: {{ totalResidentsCount }} | Deaths: {{ deathsCount }} | Injured:
                        {{ injuredCount }}
                      </p>
                    </div>
                    <div class="text-right">
                      <p class="text-2xl font-bold text-blue-600">{{ totalHumanImpact }}</p>
                      <p class="text-sm text-gray-500">total affected</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Submit Section -->
        <div class="bg-white rounded-2xl shadow-xl p-6 mt-8 border border-gray-200">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div class="flex-1">
              <div class="flex items-start">
                <div class="flex-shrink-0 mt-1">
                  <div
                    class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4"
                  >
                    <svg
                      class="w-6 h-6 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
                <div>
                  <p class="font-medium text-gray-800">Review and Submit</p>
                  <p class="text-sm text-gray-500 mt-1">
                    Please ensure all information is accurate.
                    <span v-if="missingRequiredFields.length > 0" class="text-red-500 block mt-1">
                      Missing required fields: {{ missingRequiredFields.join(', ') }}
                    </span>
                    <span v-if="validationErrors.length > 0" class="text-red-500 block mt-1">
                      Validation errors: {{ validationErrors.join(', ') }}
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <div class="flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                :disabled="
                  isSubmitting || missingRequiredFields.length > 0 || validationErrors.length > 0
                "
                :class="[
                  'px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50 transition-all shadow-lg',
                  isSubmitting || missingRequiredFields.length > 0 || validationErrors.length > 0
                    ? 'opacity-70 cursor-not-allowed'
                    : 'hover:from-blue-700 hover:to-blue-800 hover:shadow-xl transform hover:-translate-y-0.5',
                ]"
              >
                <div class="flex items-center justify-center">
                  <svg
                    v-if="isSubmitting"
                    class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    ></circle>
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <svg
                    v-else
                    class="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {{ isSubmitting ? 'Submitting...' : 'Submit Report' }}
                </div>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>

    <modal-vue :is-open="showSuccessModal" @close="resetForm">
      <template #icon>
        <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <svg
            class="w-10 h-10 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      </template>
      <template #title> Report Submitted Successfully! </template>
      <template #content>
        <p>
          Your disaster report has been received. Our team will review it and contact you if
          additional information is needed.
        </p>
      </template>
      <template #actions>
        <button
          @click="resetForm"
          class="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Submit Another Report
        </button>
      </template>
    </modal-vue>
    <!-- Error Modal -->
    <modal-vue :is-open="showErrorModal" @close="showErrorModal = false">
      <template #icon>
        <div class="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
          <svg class="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      </template>

      <template #title> Submission Failed </template>

      <template #content>
        <p>
          {{ errorMessage || 'There was an error submitting your report. Please try again.' }}
        </p>
      </template>

      <template #actions>
        <button
          @click="showErrorModal = false"
          class="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
        >
          Close
        </button>
        <button
          @click="showErrorModal = false"
          class="flex-1 px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </template>
    </modal-vue>

    <!-- Success Modal 
    <div
      v-if="showSuccessModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div class="bg-white rounded-2xl max-w-md w-full p-8 text-center">
        <div
          class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <svg
            class="w-10 h-10 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 class="text-2xl font-bold text-gray-800 mb-3">Report Submitted Successfully!</h3>
        <p class="text-gray-600 mb-6">
          Your disaster report has been received. Our team will review it and contact you if
          additional information is needed.
        </p>
        <button
          @click="resetForm"
          class="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Submit Another Report
        </button>
      </div>
     </div> -->
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useReportStore } from '../store/reportsStore'
import { useRouter } from 'vue-router'
import modalVue from '@/components/modalVue.vue'
const store = useReportStore()
const router = useRouter()

// Section 1: Disaster Details
const disasterType = ref('')
const location = ref('')
const locationLoading = ref(false)
const locationError = ref('')
const disasterTypeError = ref('')

const disasterTypes = [
  { value: 'flood', label: 'Flood', emoji: '🌊' },
  { value: 'earthquake', label: 'Earthquake', emoji: '🌋' },
  { value: 'fire', label: 'Fire', emoji: '🔥' },
  { value: 'land_slide', label: 'Landslide', emoji: '🏔️' },
]

// Section 2: Impact Assessment (matching database column names)
const areAnimalsImpacted = ref(false)
const isHomeImpacted = ref(false)
const isShopImpacted = ref(false)

// Animal counts (match database column names)
const bigAnimalsDeathCount = ref(0)
const bigAnimalsInjuredCount = ref(0)
const smallAnimalsDeathCount = ref(0)
const smallAnimalsInjuredCount = ref(0)

// Damage levels (match ENUM values)
const homeDamageLevel = ref(null)
const shopDamageLevel = ref(null)

const damageLevels = [
  {
    value: 'minor',
    label: 'Only Water & Silk',
    emoji: '🟡',
    description: 'Repairable damage',
    selectedClass: 'border-yellow-500 bg-yellow-50',
  },
  {
    value: 'major',
    label: 'Minor Damage',
    emoji: '🟠',
    description: '1 room or boundary wall or both',
    selectedClass: 'border-orange-500 bg-orange-50',
  },
  {
    value: 'fully_destroyed',
    label: 'Major Damage',
    emoji: '🔴',
    description: '2 rooms or above',
    selectedClass: 'border-red-500 bg-red-50',
  },
]

// Family Information (matching database column names)
const totalResidentsCount = ref(0)
const deathsCount = ref(0)
const injuredCount = ref(0)
const pregnantWomenCount = ref(0)
const disabledPersonsCount = ref(0)
const schoolGoingChildrenCount = ref(0)
const marriedCouplesCount = ref(0)

// Images
const homeImages = ref([])
const shopImages = ref([])

// Refs for file inputs
const homeImagesInput = ref(null)
const shopImagesInput = ref(null)

// Submission State
const isSubmitting = ref(false)
const showSuccessModal = ref(false)
const showErrorModal = ref(false)
const errorMessage = ref('')

// Computed Properties
const familyFields = computed(() => [
  {
    id: 'deaths',
    label: 'Deaths',
    model: 'deathsCount',
    value: deathsCount.value,
    hint: `Cannot exceed total residents (${totalResidentsCount.value})`,
  },
  {
    id: 'injured',
    label: 'Injured',
    model: 'injuredCount',
    value: injuredCount.value,
    hint: `Cannot exceed residents minus deaths (${totalResidentsCount.value - deathsCount.value})`,
  },
  {
    id: 'pregnantWomen',
    label: 'Pregnant Women',
    model: 'pregnantWomenCount',
    value: pregnantWomenCount.value,
  },
  {
    id: 'disabledPersons',
    label: 'Disabled Persons',
    model: 'disabledPersonsCount',
    value: disabledPersonsCount.value,
  },
  {
    id: 'schoolChildren',
    label: 'School Going Children',
    model: 'schoolGoingChildrenCount',
    value: schoolGoingChildrenCount.value,
  },
  {
    id: 'marriedCouples',
    label: 'Married Couples',
    model: 'marriedCouplesCount',
    value: marriedCouplesCount.value,
    hint: `Max ${Math.floor(totalResidentsCount.value / 2)} couples`,
  },
])

// Validation computed properties
const missingRequiredFields = computed(() => {
  const missing = []

  // Disaster Details
  if (!disasterType.value) missing.push('Disaster Type')
  if (!location.value) missing.push('Location')

  // Total Residents is always required
  if (totalResidentsCount.value <= 0) missing.push('Total Residents (must be > 0)')

  // Impact-specific requirements
  if (isHomeImpacted.value && !homeDamageLevel.value) {
    missing.push('Home Damage Level')
  }

  if (isShopImpacted.value && !shopDamageLevel.value) {
    missing.push('Shop Damage Level')
  }

  // Photo requirements for ALL damage levels (not just fully_destroyed)
  if (isHomeImpacted.value && homeDamageLevel.value && homeImages.value.length === 0) {
    missing.push('Home Damage Evidence (1 photo required)')
  }

  if (isShopImpacted.value && shopDamageLevel.value && shopImages.value.length === 0) {
    missing.push('Shop Damage Evidence (1 photo required)')
  }

  return missing
})

const validationErrors = computed(() => {
  const errors = []

  // Family logic validation
  if (deathsCount.value > totalResidentsCount.value) {
    errors.push('Deaths cannot exceed total residents')
  }

  if (injuredCount.value > totalResidentsCount.value - deathsCount.value) {
    errors.push('Injuries cannot exceed residents minus deaths')
  }

  if (pregnantWomenCount.value > totalResidentsCount.value) {
    errors.push('Pregnant women count cannot exceed total residents')
  }

  if (disabledPersonsCount.value > totalResidentsCount.value) {
    errors.push('Disabled persons count cannot exceed total residents')
  }

  if (schoolGoingChildrenCount.value > totalResidentsCount.value) {
    errors.push('School children count cannot exceed total residents')
  }

  if (marriedCouplesCount.value * 2 > totalResidentsCount.value) {
    errors.push('Too many married couples for total residents')
  }

  // Animal validation
  if (areAnimalsImpacted.value) {
    const totalAnimals =
      bigAnimalsDeathCount.value +
      bigAnimalsInjuredCount.value +
      smallAnimalsDeathCount.value +
      smallAnimalsInjuredCount.value
    if (totalAnimals <= 0) {
      errors.push('If animals impacted, total animal count must be > 0')
    }
  } else {
    // If animals not impacted, all counts should be 0
    if (
      bigAnimalsDeathCount.value > 0 ||
      bigAnimalsInjuredCount.value > 0 ||
      smallAnimalsDeathCount.value > 0 ||
      smallAnimalsInjuredCount.value > 0
    ) {
      errors.push('Animal counts must be 0 when animals not impacted')
    }
  }

  // Minimum impact validation
  const hasImpact =
    areAnimalsImpacted.value ||
    isHomeImpacted.value ||
    isShopImpacted.value ||
    deathsCount.value > 0 ||
    injuredCount.value > 0
  if (!hasImpact) {
    errors.push(
      'At least one impact category must be reported (animals, home, shop, or human casualties)'
    )
  }

  return errors
})

const totalAnimalDeaths = computed(() => {
  return bigAnimalsDeathCount.value + smallAnimalsDeathCount.value
})

const totalAnimalInjured = computed(() => {
  return bigAnimalsInjuredCount.value + smallAnimalsInjuredCount.value
})

const totalAnimalImpact = computed(() => {
  return totalAnimalDeaths.value + totalAnimalInjured.value
})

const totalHumanImpact = computed(() => {
  return deathsCount.value + injuredCount.value
})

// Helper method to get damage level label
const getDamageLevelLabel = (level) => {
  const damageLevel = damageLevels.find((dl) => dl.value === level)
  return damageLevel ? damageLevel.label.toLowerCase() : 'damage'
}

// Helper method to format file size
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Form Progress Calculation
const calculateProgress = () => {
  let completed = 0
  let totalFields = 0

  // Section 1: Disaster Details (2 fields)
  totalFields += 2
  if (disasterType.value) completed += 1
  if (location.value) completed += 1

  // Section 2: Impact Assessment
  // Home (damage level + image)
  totalFields += 2
  if (isHomeImpacted.value) {
    if (homeDamageLevel.value) completed += 1
    if (homeImages.value.length > 0) completed += 1
  } else {
    completed += 2 // Not impacted counts as complete
  }

  // Shop (damage level + image)
  totalFields += 2
  if (isShopImpacted.value) {
    if (shopDamageLevel.value) completed += 1
    if (shopImages.value.length > 0) completed += 1
  } else {
    completed += 2 // Not impacted counts as complete
  }

  // Animals
  totalFields += 1
  if (areAnimalsImpacted.value && totalAnimalImpact.value > 0) completed += 1
  else if (!areAnimalsImpacted.value) completed += 1

  // Family - Total Residents is required
  totalFields += 1
  if (totalResidentsCount.value > 0) completed += 1

  return Math.min(Math.round((completed / totalFields) * 100), 100)
}

// Location Methods
const getCurrentLocation = () => {
  if (!navigator.geolocation) {
    locationError.value = 'Geolocation is not supported by your browser.'
    return
  }

  locationLoading.value = true
  locationError.value = ''

  navigator.geolocation.getCurrentPosition(
    (position) => {
      location.value = `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(
        6
      )}`
      locationLoading.value = false
    },
    (error) => {
      console.error('Error getting location:', error)
      locationError.value = 'Unable to get current location. Please enable location services.'
      locationLoading.value = false
    },
    {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0,
    }
  )
}

// Image Handling Methods
const triggerHomeUpload = () => {
  homeImagesInput.value?.click()
  shopImages.value = []
}

const triggerShopUpload = () => {
  shopImagesInput.value?.click()
}

const handleHomeImages = (event) => {
  const files = Array.from(event.target.files)
  processImages(files, homeImages, 1) // Changed from 10 to 1
}

const handleShopImages = (event) => {
  const files = Array.from(event.target.files)
  processImages(files, shopImages, 1) // Changed from 10 to 1
}

const processImages = (files, targetArray, maxFiles) => {
  const currentCount = targetArray.value.length
  const availableSlots = maxFiles - currentCount

  if (availableSlots <= 0) {
    // For single image, replace existing image
    targetArray.value = []
  }

  // Only take the first file (single image upload)
  const file = files[0]

  if (!file) return

  if (file.size > 10 * 1024 * 1024) {
    alert(`File ${file.name} exceeds 10MB limit`)
    return
  }

  if (!file.type.startsWith('image/')) {
    alert(`File ${file.name} is not an image`)
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    targetArray.value = [
      {
        file: file,
        name: file.name,
        size: file.size,
        preview: e.target.result,
      },
    ]
  }
  reader.readAsDataURL(file)

  if (files.length > 1) {
    alert(`Only 1 image allowed. Using the first image.`)
  }
}

const removeHomeImage = (index) => {
  homeImages.value.splice(index, 1)
}

const removeShopImage = (index) => {
  shopImages.value.splice(index, 1)
}

// Animal Count Methods
const incrementAnimals = (type) => {
  switch (type) {
    case 'smallDeaths':
      smallAnimalsDeathCount.value += 1
      break
    case 'smallInjured':
      smallAnimalsInjuredCount.value += 1
      break
    case 'bigDeaths':
      bigAnimalsDeathCount.value += 1
      break
    case 'bigInjured':
      bigAnimalsInjuredCount.value += 1
      break
  }
}

const decrementAnimals = (type) => {
  switch (type) {
    case 'smallDeaths':
      if (smallAnimalsDeathCount.value > 0) smallAnimalsDeathCount.value -= 1
      break
    case 'smallInjured':
      if (smallAnimalsInjuredCount.value > 0) smallAnimalsInjuredCount.value -= 1
      break
    case 'bigDeaths':
      if (bigAnimalsDeathCount.value > 0) bigAnimalsDeathCount.value -= 1
      break
    case 'bigInjured':
      if (bigAnimalsInjuredCount.value > 0) bigAnimalsInjuredCount.value -= 1
      break
  }
}

// Family Count Methods
const increment = (field) => {
  const fieldRef = getFieldRef(field)

  // Additional validation for specific fields
  if (field === 'deathsCount' && fieldRef.value >= totalResidentsCount.value) {
    return // Cannot exceed total residents
  }

  if (field === 'injuredCount' && fieldRef.value >= totalResidentsCount.value - deathsCount.value) {
    return // Cannot exceed residents minus deaths
  }

  if (
    field === 'marriedCouplesCount' &&
    fieldRef.value >= Math.floor(totalResidentsCount.value / 2)
  ) {
    return // Cannot exceed half of total residents
  }

  fieldRef.value += 1
}

const decrement = (field) => {
  const fieldRef = getFieldRef(field)
  if (fieldRef.value > 0) {
    fieldRef.value -= 1
  }
}

const validateCount = (field, value) => {
  const fieldRef = getFieldRef(field)
  const num = parseInt(value)

  if (isNaN(num) || num < 0) {
    fieldRef.value = 0
    return
  }

  // Additional validation
  if (field === 'deathsCount' && num > totalResidentsCount.value) {
    fieldRef.value = totalResidentsCount.value
    return
  }

  if (field === 'injuredCount' && num > totalResidentsCount.value - deathsCount.value) {
    fieldRef.value = totalResidentsCount.value - deathsCount.value
    return
  }

  if (field === 'marriedCouplesCount' && num > Math.floor(totalResidentsCount.value / 2)) {
    fieldRef.value = Math.floor(totalResidentsCount.value / 2)
    return
  }

  fieldRef.value = num
}

const getFieldRef = (field) => {
  switch (field) {
    // Family fields
    case 'totalResidentsCount':
      return totalResidentsCount
    case 'deathsCount':
      return deathsCount
    case 'injuredCount':
      return injuredCount
    case 'pregnantWomenCount':
      return pregnantWomenCount
    case 'disabledPersonsCount':
      return disabledPersonsCount
    case 'schoolGoingChildrenCount':
      return schoolGoingChildrenCount
    case 'marriedCouplesCount':
      return marriedCouplesCount
    // Animal fields
    case 'smallAnimalsDeathCount':
      return smallAnimalsDeathCount
    case 'smallAnimalsInjuredCount':
      return smallAnimalsInjuredCount
    case 'bigAnimalsDeathCount':
      return bigAnimalsDeathCount
    case 'bigAnimalsInjuredCount':
      return bigAnimalsInjuredCount
    default:
      return totalResidentsCount
  }
}

// Reset animal counts when animals not impacted
const resetAnimalCounts = () => {
  if (!areAnimalsImpacted.value) {
    bigAnimalsDeathCount.value = 0
    bigAnimalsInjuredCount.value = 0
    smallAnimalsDeathCount.value = 0
    smallAnimalsInjuredCount.value = 0
  }
}

// Reset damage levels when not impacted
const resetHomeDamageLevel = () => {
  if (!isHomeImpacted.value) {
    homeDamageLevel.value = null
  }
}

const resetShopDamageLevel = () => {
  if (!isShopImpacted.value) {
    shopDamageLevel.value = null
  }
}

// Watch for changes
watch(areAnimalsImpacted, (newVal) => {
  if (!newVal) resetAnimalCounts()
})

watch(isHomeImpacted, (newVal) => {
  if (!newVal) resetHomeDamageLevel()
})

watch(isShopImpacted, (newVal) => {
  if (!newVal) resetShopDamageLevel()
})

// Form Submission
const submitForm = async () => {
  // Validate required fields
  if (missingRequiredFields.value.length > 0) {
    alert(`Please fill in all required fields:\n${missingRequiredFields.value.join('\n')}`)
    return
  }

  // Validate business logic
  if (validationErrors.value.length > 0) {
    alert(`Please fix the following errors:\n${validationErrors.value.join('\n')}`)
    return
  }

  isSubmitting.value = true

  try {
    // ✅ SINGLE FormData for everything
    const formData = new FormData()

    // ─────────────────────────────
    // Disaster Details
    // ─────────────────────────────
    formData.append('disaster_type', disasterType.value)
    formData.append('location', location.value)

    // ─────────────────────────────
    // Animals
    // ─────────────────────────────
    formData.append('are_animals_impacted', areAnimalsImpacted.value)
    formData.append('big_animals_death_count', bigAnimalsDeathCount.value)
    formData.append('big_animals_injured_count', bigAnimalsInjuredCount.value)
    formData.append('small_animals_death_count', smallAnimalsDeathCount.value)
    formData.append('small_animals_injured_count', smallAnimalsInjuredCount.value)

    // ─────────────────────────────
    // Home
    // ─────────────────────────────
    formData.append('is_home_impacted', isHomeImpacted.value)
    if (isHomeImpacted.value) {
      formData.append('home_damage_level', homeDamageLevel.value)
    }

    // ─────────────────────────────
    // Shop
    // ─────────────────────────────
    formData.append('is_shop_impacted', isShopImpacted.value)
    if (isShopImpacted.value) {
      formData.append('shop_damage_level', shopDamageLevel.value)
    }

    // ─────────────────────────────
    // Human / Family
    // ─────────────────────────────
    formData.append('total_residents_count', totalResidentsCount.value)
    formData.append('deaths_count', deathsCount.value)
    formData.append('injured_count', injuredCount.value)
    formData.append('pregnant_women_count', pregnantWomenCount.value)
    formData.append('disabled_persons_count', disabledPersonsCount.value)
    formData.append('school_going_children_count', schoolGoingChildrenCount.value)
    formData.append('married_couples_count', marriedCouplesCount.value)

    // ─────────────────────────────
    // Images (same request)
    // ─────────────────────────────
    if (homeImages.value.length > 0) {
      formData.append('home_images', homeImages.value[0].file)
    }

    if (shopImages.value.length > 0) {
      formData.append('shop_images', shopImages.value[0].file)
    }

    // ✅ ONE API CALL
    const response = await store.addReport(formData)

    console.log('Report created successfully:', response)

    // Show success modal
    // referenceId.value = 'DIS-' + Date.now().toString().slice(-8)
    showSuccessModal.value = true
    showErrorModal.value = false
  } catch (error) {
    console.error('Error submitting form:', error)
    showSuccessModal.value = false
    showErrorModal.value = true
    // alert('Error submitting form. Please try again.')
    errorMessage.value = error.response.data.message || error.message
  } finally {
    isSubmitting.value = false
  }
}

const resetForm = () => {
  // Section 1: Disaster Details
  disasterType.value = ''
  location.value = ''
  disasterTypeError.value = ''
  locationError.value = ''

  // Section 2: Impact Assessment
  areAnimalsImpacted.value = false
  isHomeImpacted.value = false
  isShopImpacted.value = false

  // Reset all counts to 0
  bigAnimalsDeathCount.value = 0
  bigAnimalsInjuredCount.value = 0
  smallAnimalsDeathCount.value = 0
  smallAnimalsInjuredCount.value = 0

  homeDamageLevel.value = null
  shopDamageLevel.value = null

  // Family Information
  totalResidentsCount.value = 0
  deathsCount.value = 0
  injuredCount.value = 0
  pregnantWomenCount.value = 0
  disabledPersonsCount.value = 0
  schoolGoingChildrenCount.value = 0
  marriedCouplesCount.value = 0

  // Images
  homeImages.value = []
  shopImages.value = []

  // Clear file inputs
  if (homeImagesInput.value) homeImagesInput.value.value = ''
  if (shopImagesInput.value) shopImagesInput.value.value = ''

  // Submission State
  showSuccessModal.value = false
  isSubmitting.value = false
}

// Lifecycle
onMounted(() => {
  // Auto-get location on mount if permission is granted
  if (navigator.permissions && navigator.permissions.query) {
    navigator.permissions.query({ name: 'geolocation' }).then((result) => {
      if (result.state === 'granted') {
        getCurrentLocation()
      }
    })
  }
})
</script>

<style scoped>
/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Smooth transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

/* File upload hover effects */
input[type='file'] + label:hover {
  transform: translateY(-2px);
}

/* Number input hide arrows */
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type='number'] {
  -moz-appearance: textfield;
}

/* Focus styles */
:focus {
  outline: none;
}

/* Custom animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.form-section {
  animation: fadeIn 0.5s ease-out;
}
</style>
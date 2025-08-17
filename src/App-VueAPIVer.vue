<template>
  <h1>Form</h1>
  <div style="display:flex; flex-direction: column;gap:8px; padding: 16px">
    <label>Name: <input v-model="person.name" required /></label>
    <p style="color: red">{{ errorMessages.name }}</p>
    <label>Age: <input v-model.number="person.age" required /></label>
    <p style="color: red">{{ errorMessages.age }}</p>
    <label>Email: <input v-model="person.email_address" /></label>  
    <p style="color: red">{{ errorMessages.email_address }}</p>  
  </div>
  <div style="display:flex; flex-direction: column;gap:8px; padding: 8px; border: solid; margin-top:16px;">
    <p id="name">Name: {{ person.name }}</p>
    <p id="age">Age: {{ person.age }}</p>
    <p id="email">Email: {{ person.email_address }}</p>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from "vue"

type Person = {
  name: string
  age: number
  email_address: string
  secret_info: string
}

type ErrorMessages = {
  name?: string
  age?: string
  email_address?: string
}

// 初期データ
const _person: Person = {
  name: 'Hogeta Hogeo',
  age: 19,
  email_address: 'hoge@example.com',
  secret_info: 'Hides 100M dollar in his neighborhood'
}

// バリデーション関数
const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

// リアクティブなデータ
const person = reactive(structuredClone(_person))
const errorMessages = reactive<ErrorMessages>({})

// バリデーション関数
const validateAge = (value: number | string) => {
  if (isNaN(Number(value)) || Number(value) >= 150 || Number(value) < 0 || value === "") {
    errorMessages.age = "無効な値です! 0 ~ 150の間で入力してください。"
  } else {
    errorMessages.age = undefined
  }
}

const validateEmail = (value: string) => {
  if (value && !isValidEmail(value)) {
    errorMessages.email_address = "無効なemailです!"
  } else {
    errorMessages.email_address = undefined
  }
}

// プロパティの変更を監視（watcherの代替）
watch(
  () => person.name,
  (newValue, oldValue) => {
    console.log(`WATCHER NAME: ${newValue}`)
  }
)

watch(
  () => person.age,
  (newValue, oldValue) => {
    console.log(`WATCHER AGE: ${newValue}`)
    validateAge(newValue)
  }
)

watch(
  () => person.email_address,
  (newValue, oldValue) => {
    console.log(`WATCHER EMAIL: ${newValue}`)
    validateEmail(newValue)
  }
)

// 初期バリデーション
validateAge(person.age)
validateEmail(person.email_address)

// secret_infoへのアクセスを防ぐgetter（必要に応じて）
// const getPersonProperty = (prop: keyof Person) => {
//   if (prop === 'secret_info') {
//     throw new Error('This property is private!!')
//   }
//   return person[prop]
// }
</script>
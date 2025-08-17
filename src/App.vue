<template>
  <h1>Form</h1>
  <div style="display:flex; flex-direction: column;gap:8px; padding: 16px">
    <label>Name: <input  v-model="proxy.name" required /></label>
    <p style="color: red">{{proxy.name_errorMsg}}</p>
    <label>Age: <input v-model.number="proxy.age" required /></label>
    <p style="color: red">{{proxy.age_errorMsg}}</p>
    <label>Email: <input v-model="proxy.email_address" /></label>  
    <p style="color: red">{{proxy.email_address_errorMsg}}</p>  
  </div>
  <div style="display:flex; flex-direction: column;gap:8px; padding: 8px; border: solid; margin-top:16px;">
    <p id="name">Name: {{proxy.name}}</p>
    <p id="age">Age: {{proxy.age}}</p>
    <p id="email">Email: {{proxy.email_address}}</p>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue"
import { proxyWrapper, handlerWrapper, type FormObjWrapper } from "./ProxyWrapper"

type Person = {
  name: string
  age: number
  email_address: string
  secret_info: string
}

const _person:FormObjWrapper<Person> = {
  name: 'Hogeta Hogeo',
  age: 19,
  email_address: 'hoge@example.com',
  secret_info: 'Hides 100M dollar in his neighborhood'
}

const isValidEmail =(value:string)=> /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

/**
 * personオブジェクトのカスタムハンドラ
 */
const personHandler = handlerWrapper<FormObjWrapper<Person>>({
  get:(target, prop, receiver) => {
    // privateプロパティ
    // ユーザーの参照を阻止する
    if(prop === 'secret_info') {
        throw new Error('This property is private!!')
    }
  },
  set:(target, property, value, receiver) => {
    // バリデーション: age
    if(property === 'age') {
      if((isNaN(value) || value >= 150 || value < 0|| value === "")) {
        target.age_errorMsg = "無効な値です! 0 ~ 150の間で入力してください。"
      } else {
        target.age_errorMsg = undefined
      }
    }
    // バリデーション: email
    if (property === "email_address") {
      if(value && !isValidEmail(value)) {
        target.email_address_errorMsg = "無効なemailです!"
      } else {
        target.email_address_errorMsg = undefined
      }
    }
    return Reflect.set(target, property, value, receiver)
  },
  // 福作用 watcher
  watcher: [
    {
      property: 'name',
      callback: (value) => {
        console.log(`WATCHER NAME: ${value}`)
      }
    },
    {
      property: 'age',
      callback: (value) => {
        console.log(`WATCHER AGE: ${value}`)
      }
    },
    {
      property: 'email_address',
      callback: (value) => {
        console.log(`WATCHER EMAIL: ${value}`)
      }
    },
  ]
})

// deep copy
const person = structuredClone(_person)
// 値が変更されたらコンポーネントを再レンダリングしてほしいのでreactiveオブジェクトにする
const proxy = reactive(proxyWrapper<FormObjWrapper<Person>>(person, personHandler))
</script>

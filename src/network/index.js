import axios from 'axios'

export function request(config){
  const findjson = axios.create({
    baseURL:'http://123.207.32.32:8000',
    timeout: 5000
  })
  return findjson(config);
}

export function requestMysql(config){
  const findjson = axios.create({
    baseURL:'http://localhost:5000',
    timeout: 5000
  })
  return findjson(config);
}
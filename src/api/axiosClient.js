import axios from "axios";
import { BASE_API_PATH } from "../constants/path";

const instance = axios.create({
    baseURL: BASE_API_PATH,
    timeout: 10000,
    headers: {'Content-Type': 'application/json'}
  });

export default instance;
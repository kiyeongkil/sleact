import axios from 'axios';

const fetcher = (url: string) => axios.get(url, {
    /*
    * BE - FE 서버가 다를때 쿠키 공유
    * BE: 생성 / FE: 전송
    */
    withCredentials: true, 
}).then((response) => response.data);

export default fetcher;
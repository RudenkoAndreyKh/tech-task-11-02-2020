import axios from 'axios';
import moment from 'moment';

const AxiosInstance = axios.create({
  baseURL: 'https://gorest.co.in',
  headers: {
    'Content-Type': 'application/json',
    'api-version': '1.0',
    'user-agent-timestamp': moment(new Date()).unix().toString()
  }
});

class PlanetService {
  public getPlanets(page: number) {
    return AxiosInstance.get(`https://swapi.co/api/planets/?page=${page}`);
  }

  public getFilm(link: string) {
    return AxiosInstance.get(link);
  }

  public getInhabitants(link: string) {
    return AxiosInstance.get(link);
  }
}

export default new PlanetService();
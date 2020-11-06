import axios from 'axios'

const buildClient = ({req}) => {
  if (typeof window === 'undefined'){
    // We are on the server
    // http://SERVICENAME.NAMESPACE.svc.cluster.local
    return axios.create({
      baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      headers: req.headers, // Pass all the request headers through to the load balancer
      // headers: {
      //   Host: 'ticketing.dev', // We need to specify the host for the load balancer
      // }
    })
  }else{
    return axios.create({
      baseURL: '/'
    })
  }
}

export default buildClient

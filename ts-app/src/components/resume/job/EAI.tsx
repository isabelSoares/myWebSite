import React from 'react';
import './EAI.scss';
import { Typography } from '@mui/material';


interface IProps {}

export const EAI = (props: IProps) => {   
    return(
        <div className="eai">
            <Typography className='eai'>
                  <p>
                      As you can see I always want to learn more and after finishing my master and having successfully defended my master thesis, I was not sure of 
                      which computer science area I really wanted to follow.
                      That is why, I decided to risk and explore a different area, completely out of my confort zone and specialization scope: Enterprise Integration and Middleware.<br />
                      In December of 2022, I started working at <a href='https://www.vodafone.pt/'  target="_blank">Vodafone</a> at Portugal, with the role of <b>Enterprise Application Integration Developer</b>. 
                      My main responsabilities are project development using <a href='https://www.softwareag.com/en_corporate/platform/integration-apis/webmethods-integration.html'  target="_blank">WebMethods Integration server platform</a>  
                      &emsp;and  API virtualization, using <b>API Gateway</b>. <br/>
                  </p>
                  <p>
                      With this job, I have been acquiring some knowledge about the following <b>tecnologies/tools</b>: Software AG WebMethods, Splunk Enterprise, Jira, SoapUI, Postman, WebServices API and WinSCP.
                  </p>
              </Typography>
        </div>
    )
}
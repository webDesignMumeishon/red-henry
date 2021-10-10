import React from 'react'
import { AiFillGithub } from 'react-icons/ai';
import { AiFillLinkedin } from 'react-icons/ai';
import { AiOutlineMail } from 'react-icons/ai';


export const UserInfo = ({detail, close}) => {

    const handleContainerClick = (e) => e.stopPropagation();

    const conditionalOpen = detail.toggle ? "none" : "flex";

    return (
        <article className={"info"} onClick={close} style={{display: conditionalOpen}}>

            <div className="card" onClick={handleContainerClick}>
                <button className="btn-info" onClick={close}>X</button>
                <div className="card-image"></div>
                <div className="card-text">
                    <span className="date">Cohorte: {detail.cohorte}</span>
                    <h2>{detail.nombre}</h2>
                    <p>{detail.email}</p>
                    <form method="post" action={`mailto:${detail.email}`} >
                        <input id="send-mail" className="send-email-btn" type="submit" value="Contact" /> 
                    </form>
                </div>
                <div className="card-stats">
                    <div className="stat" >
                        <div className="value" for="send-mail"><a href="#"><AiOutlineMail/></a> </div>
                        <div className="type"> Contact</div>
                    </div>

                    <div className="stat border-stats">
                        <div className="value "><a href={detail.linkedin} target="_blank"><AiFillLinkedin/></a></div>
                        <div className="type"> Linkedin</div>
                    </div>
                    
                    <div className="stat">
                        <div className="value"><a href={detail.github} target="_blank"><AiFillGithub/></a></div>
                        <div className="type">Github</div>
                    </div>
                </div>
                
            </div>
            
        </article>
    )
}

// {/* <ul className="social-icons">
// <li><a href={detail.github} target="_blank"><AiFillGithub/></a></li>
// <li><a href={detail.linkedin} target="_blank"><AiFillLinkedin/></a></li>
// </ul> */}
// {/* <button className="btn-info" onClick={close}>X</button>
// <div className="body-info">
// <h3 className="info-title"></h3>
// <p></p>
// <p>{detail.email}</p>  
// <form  method="post" action={`mailto:${detail.email}`} >
// <input className="send-email-btn" type="submit" value="Contact" /> 
// </form>
//     <ul className="social-icons">
//     </ul>
// </div> */}
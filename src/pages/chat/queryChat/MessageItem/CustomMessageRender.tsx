import { FC } from "react";

import { IMessageItemProps } from ".";
import styles from "./message-item-custom.module.scss";
import clsx from "clsx";

const CustomMessageRender: FC<IMessageItemProps> = ({ message }) => {
  debugger
  let elms =JSON.parse( message.customElem?.data) ;

  let content= JSON.parse(elms.data);

  return (

    <div className={styles.jlBox}>
               
    <div className={styles.jlHead}>
         <img src="http://djt-bucket-public-release.oss-cn-shenzhen.aliyuncs.com/Center/Attachment/80395299/Certification/IMG_20231204_11241520231204112416638.jpg" alt="" className={styles.jlHeadImg}/>
         <span className={styles.jlHeadName}>谷**</span> |
         <span className={styles.jlHeadSex}>男</span> |
         <span className={styles.jlHeadAge}>&lt;16</span>
     </div>      
     <div className={styles.jlMidMY}>面议</div>
     <div className={styles.jlTX}>
         <span>体系认证</span>
         <span className={styles.jlTXP}>·</span>
         <span>全职</span>
     </div>
     <div className={styles.jlInfo}>
         <span className={styles.jlInfoUser}>湖南-郴州</span>
         <span className={styles.jlInfoUser}>5-7年</span>
         <span className={styles.jlInfoUser}>MBA</span>
     </div>
     <div className={styles.jlBoot}>
         <img src="/assets/user/user01.jpg" alt=""/>
         <div>点金台简历</div>
     </div>
 </div>
  ); 


  if(elms.extension=="position_msg"){
     return (

      <div className={clsx(styles.content)} >
        <div className={clsx(styles.postionMain)} >
          <div className={clsx(styles.headbox)} >
            <img src={content.CompanyUrl} alt="" className={styles.headw} />
          </div>
          <div className={styles.positionbox} >
            <div className={styles.positontype}>{content.PostType}/{content.PostName}</div>
            <div className={styles.postionmy}>{content.Payroll}</div>
            <div className={styles.positonname}>{content.CompanyName}</div>
          </div>
        </div>
        <div className={styles.positionlistbox}>
          <img src="/assets/user/user01.jpg" alt=""/>
            <div>点金台职位</div>
        </div>
      </div>
    ); 

  }else if (elms.extension=="resume_msg"){
    return (

      <div className={clsx(styles.content)} >
        <div className={clsx(styles.postionMain)} >
          <div className={clsx(styles.headbox)} >
            <img src={content.CompanyUrl} alt="" className={styles.headw} />
          </div>
          <div className={styles.positionbox} >
            <div className={styles.positontype}>{content.PostType}/{content.PostName}</div>
            <div className={styles.postionmy}>{content.Payroll}</div>
            <div className={styles.positonname}>{content.CompanyName}</div>
          </div>
        </div>
        <div className={styles.positionlistbox}>
          <img src="/assets/user/user01.jpg" alt=""/>
            <div>点金台职位</div>
        </div>
      </div>
    ); 
  }else{

    return (
      <div className={styles.noShow}>web端暂不支持分享商品消息显示</div>
    );
  }
  




};

export default CustomMessageRender;

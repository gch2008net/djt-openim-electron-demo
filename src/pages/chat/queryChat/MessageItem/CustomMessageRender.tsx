import { FC } from "react";

import { IMessageItemProps } from ".";
import styles from "./message-item-custom.module.scss";
import clsx from "clsx";

const CustomMessageRender: FC<IMessageItemProps> = ({ message }) => {
  let content = JSON.parse(message.customElem?.data);
  if (message.customElem.extension == "position_msg") {
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
          {/* <img src="/assets/user/user01.jpg" alt=""/> */}
          <div>点金台职位</div>
        </div>
      </div>
    );

  } else if (message.customElem.extension == "browsePosition_msg") {
    return (

      <div className={clsx(styles.content)} >
        <div className={clsx(styles.postionMain)} >
          <div className={clsx(styles.headbox)} >
            <img src={content.companyHeadUri} alt="" className={styles.headw} />
          </div>
          <div className={styles.positionbox} >
            <div className={styles.positontype}>{content.education}/{content.jobName}</div>
            <div className={styles.postionmy}>{content.salary}</div>
            <div className={styles.positonname}>{content.companyName}</div>
          </div>
        </div>
        <div className={styles.positionlistbox}>
          {/* <img src="/assets/user/user01.jpg" alt=""/> */}
          <div>点金台职位</div>
        </div>
      </div>
    );

  }
  else if (message.customElem.extension == "resume_msg") {
    return (

      <div className={styles.jlBox}>

        <div className={styles.jlHead}>
          <img src={content.Path} alt="" className={styles.jlHeadImg} />
          <span className={styles.jlHeadName}>{content.RealName}</span> |
          <span className={styles.jlHeadSex}>{content.Gender == "1" ? "男" : "女"}</span> |
          <span className={styles.jlHeadAge}>&lt;{content.Age}</span>
        </div>
        <div className={styles.jlMidMY}>{content.Salary}</div>
        <div className={styles.jlTX}>
          <span>{content.Position}</span>
          <span className={styles.jlTXP}>·</span>
          <span>{content.JobType}</span>
        </div>
        <div className={styles.jlInfo}>
          <span className={styles.jlInfoUser}>{content.Area}</span>
          <span className={styles.jlInfoUser}>{content.WorkYears}</span>
          <span className={styles.jlInfoUser}>{content.EducationalBackground}</span>
        </div>
        <div className={styles.jlBoot}>
          {/* <img src="/assets/user/user01.jpg" alt=""/> */}
          <div>点金台简历</div>
        </div>
      </div>
    );
  } else {

    return (
      <div className={styles.noShow}>web端暂不支持的消息显示</div>
    );
  }





};

export default CustomMessageRender;

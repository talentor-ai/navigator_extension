import React, { useState } from 'react'
import { CustomizableComponent } from '../../../../models'
import { Box, Icons } from '../../../../components'
import styles from "./info.module.css"

interface iProps extends CustomizableComponent {
   infoId: string
   children: React.ReactNode
   title?: React.ReactNode
   icon?: string
}

const Info: React.FC<iProps> = ({ children, title, icon, infoId }: iProps) => {
   const [{ active }, setState] = useState({ active: localStorage.getItem(infoId) === 'true' })

   const handleClick = () => {
      if (localStorage.getItem(infoId) === 'true') {
         localStorage.setItem(infoId, "false")
      } else {
         localStorage.setItem(infoId, "true")
      }
      setState({ active: !active })
   }

   return (
      <Box containerMode autoSize className={styles.infoContainer}>
         <Box className={`${styles.header} ${active && styles.headerActive}`} onClick={handleClick}>
            {icon && <Icons iconType={icon} className={styles.icon} />}
            {title}
            <Icons iconType='arrowDown' className={`${styles.arrow} ${active ? styles.arrowActive : ""}`} />
         </Box>
         <Box className={`${styles.content} ${active && styles.contentActive}`}>{children}</Box>
      </Box>
   )
}

export default Info
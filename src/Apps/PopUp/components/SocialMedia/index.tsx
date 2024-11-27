import React from 'react'
import Icons from '../Icons'
import styles from './socialMedia.module.css'
import { IconSize } from '@popup/models/model.icons'

interface ISocialMediaProps {
   socialMedia: "linkedin" | "google" | "facebook"
   size: IconSize
}

const SocialMedia = ({ socialMedia, size }: ISocialMediaProps) => {
   return (
      <div className={`${styles[socialMedia]} ${styles.socialMediaIcon} ${styles[size]}`}>
         <Icons iconType={socialMedia} />
      </div>
   )
}

export default SocialMedia
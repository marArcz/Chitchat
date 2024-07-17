import React from 'react'

const UserAvatar = ({ name, size = 32, rounded = true, imgUrl = null,className='',bg='55bbb4',color='fff' }) => {

    return (
        imgUrl ? (
            <img width={size} height={size} src={imgUrl} alt="User Profile Photo" className={`p-1 ${rounded && 'rounded-full'} ${className}`} />
        ) : (
            <img width={size} height={size} src={`https://ui-avatars.com/api/?name=${name}&size=${size}&background=${bg}&color=${color}&font-size=0.38`} alt={name} className={`${rounded && 'rounded-[50%]'} ${className}`} />
        )
    )
}

export default UserAvatar

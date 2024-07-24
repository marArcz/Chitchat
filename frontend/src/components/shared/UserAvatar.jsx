import React from 'react'

const UserAvatar = ({ name, size = 32, rounded = true, imgUrl = null, className = '', bg = '55bbb4', color = 'white' }) => {

    return (
        imgUrl ? (
            <img width={size} height={size} src={imgUrl} alt="User Profile Photo" className={`p-1 ${rounded && 'rounded-full'} ${className}`} />
        ) : (
            // <img width={size} height={size} src={`https://ui-avatars.com/api/?name=${name[0]}&size=${size}&background=${bg}&color=${color}&font-size=0.38`} alt={name} className={`${rounded && 'rounded-[50%]'} ${className}`} />
            <div
                style={{
                    width: size,
                    height: size,
                    fontSize: (size * 0.03) + 'rem'
                }}
                className={`bg-gradient-secondary font-medium box-border p-1 uppercase flex justify-center items-center text-white rounded-full ${className}`}
            >
                <span>{name?name[0]:''}</span>
            </div>
        )
    )
}

export default UserAvatar

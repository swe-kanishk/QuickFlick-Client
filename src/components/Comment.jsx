import { Avatar, AvatarFallback } from '@radix-ui/react-avatar'
import React from 'react'
import { AvatarImage } from './ui/avatar'

function Comment({comment}) {
  return (
    <div className='mt-2 mb-3'>
        <div className='flex gap-3 items-start'>
            <Avatar>
                <AvatarImage src={comment?.author?.avatar} />
                <AvatarFallback>
              <img
                src="https://photosking.net/wp-content/uploads/2024/05/no-dp_16.webp"
                alt=""
                className='min-h-8 min-w-8 h-8 w-8 rounded-full'
              />
            </AvatarFallback>
            </Avatar>
            <p className='font-medium text-sm'>{comment.author.username} <span className='font-normal pl-1 text-gray-600'>{comment.text}</span></p>
        </div>
    </div>
  )
}

export default Comment

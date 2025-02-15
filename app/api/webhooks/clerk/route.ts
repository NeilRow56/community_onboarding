import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'
import { createUser } from '@/lib/users'
import { User } from '@prisma/client'
import { revalidatePath } from 'next/cache'

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET

  if (!SIGNING_SECRET) {
    throw new Error(
      'Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local'
    )
  }

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET)

  // Get headers
  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing Svix headers', {
      status: 400
    })
  }

  // Get body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  let evt: WebhookEvent

  // Verify payload with headers

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error occurred', {
      status: 400
    })
  }

  const eventType = evt.type

  if (eventType === 'user.created') {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data

    console.log(evt.data)

    if (!id || !email_addresses || !email_addresses.length) {
      return new Response('Error occurred -- missing data', {
        status: 400
      })
    }

    const email = email_addresses[0].email_address

    const user = {
      clerkUserId: id,
      firstName: first_name,
      lastName: last_name,
      email: email,
      ...(image_url ? { imageUrl: image_url } : {})
    }

    try {
      const { user: userFromDB, error } = await createUser(user as User)
      if (error) throw error
      revalidatePath(`/`)
    } catch (error) {
      return new Response('Error occurred', {
        status: 400
      })
    }

    // Trigger a workflow
  }

  return new Response('Webhook received successfully', { status: 200 })
}
// import { Webhook } from 'svix'
// import { headers } from 'next/headers'
// import { WebhookEvent } from '@clerk/nextjs/server'
// import prisma from '@/lib/prisma'

// export async function POST(req: Request) {
//   const SIGNING_SECRET = process.env.SIGNING_SECRET

//   if (!SIGNING_SECRET) {
//     throw new Error(
//       'Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local'
//     )
//   }

//   // Create new Svix instance with secret
//   const wh = new Webhook(SIGNING_SECRET)

//   // Get headers
//   const headerPayload = await headers()
//   const svix_id = headerPayload.get('svix-id')
//   const svix_timestamp = headerPayload.get('svix-timestamp')
//   const svix_signature = headerPayload.get('svix-signature')

//   // If there are no headers, error out
//   if (!svix_id || !svix_timestamp || !svix_signature) {
//     return new Response('Error: Missing Svix headers', {
//       status: 400
//     })
//   }

//   // Get body
//   const payload = await req.json()
//   const body = JSON.stringify(payload)

//   let evt: WebhookEvent

//   // Verify payload with headers
//   try {
//     evt = wh.verify(body, {
//       'svix-id': svix_id,
//       'svix-timestamp': svix_timestamp,
//       'svix-signature': svix_signature
//     }) as WebhookEvent
//   } catch (err) {
//     console.error('Error: Could not verify webhook:', err)
//     return new Response('Error: Verification error', {
//       status: 400
//     })
//   }

//   // // Do something with payload
//   // // For this guide, log payload to console
//   // const { id } = evt.data
//   // const eventType = evt.type
//   // console.log(`Received webhook with ID ${id} and event type of ${eventType}`)
//   // console.log('Webhook payload:', body)

//   if (evt.type === 'user.created') {
//     const { id, email_addresses, first_name, image_url } = evt.data
//     try {
//       const newUser = await prisma.user.create({
//         data: {
//           clerkUserId: id,
//           email: email_addresses[0].email_address,
//           firstName: first_name,
//           imageUrl: image_url
//         }
//       })
//       return new Response(JSON.stringify(newUser), {
//         status: 201
//       })
//     } catch (error) {
//       console.error('Error: Failed to store event in the database:', error)
//       return new Response('Error: Failed to store event in the database', {
//         status: 500
//       })
//     }
//   }

//   return new Response('Webhook received', { status: 200 })
// }

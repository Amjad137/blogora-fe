import Link from 'next/link';

export default function HomePage() {
  return (
    <div className='mx-auto flex min-h-[70vh] max-w-4xl flex-col items-center justify-center gap-6 px-6 text-center'>
      <h1 className='text-4xl font-bold tracking-tight sm:text-5xl'>Welcome to Blogora</h1>
      <p className='text-muted-foreground text-lg'>
        A modern blog platform with auth, feeds, and more. Get started by creating an account and
        exploring the app.
      </p>
      <div className='mt-2 flex gap-3'>
        <Link
          className='inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:opacity-90'
          href='/auth/sign-up'
        >
          Get Started
        </Link>
        <Link
          className='inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium'
          href='/feeds'
        >
          Open App
        </Link>
      </div>
    </div>
  );
}

import Image from 'next/image'
import { format } from 'date-fns'

/* ---------------------------------------------------------
   TYPES
--------------------------------------------------------- */
type ActivityMedia = {
  id: number
  media_type: 'image' | 'video' | 'audio'
  file_name: string
}

type Activity = {
  id: number
  title: string
  type: string
  description: string
  event_date: string | null
  created_at: string
  media: ActivityMedia[]
}

export const metadata = {
  title: 'Activities & Publications | Talents & Impact',
  description: 'Explore our latest news, events, and community updates.',
}

/* ---------------------------------------------------------
   PAGE COMPONENT
--------------------------------------------------------- */
export default async function PublicActivities() {
  let activities: Activity[] = []
  let error: string | null = null

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  const apiUrl = `${baseUrl}/api/activities`

  try {
    const res = await fetch(apiUrl, { cache: 'no-store' })
    if (!res.ok) throw new Error(`API responded with status: ${res.status}`)
    activities = await res.json()
  } catch (err) {
    console.error('Fetch error:', err)
    error = 'Unable to connect to the publications server.'
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center">
      {/* HERO SECTION - Centered Content */}
      <section className="w-full bg-slate-900 py-24 px-6 flex flex-col items-center justify-center text-center">
        <div className="max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">
            Our <span className="text-sky-500">Publications</span>
          </h1>
          <div className="h-1.5 w-24 bg-sky-500 mx-auto mb-8 rounded-full"></div>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Stay informed with the latest updates, event highlights, and success stories from our network.
          </p>
        </div>
      </section>

      {/* MAIN CONTENT AREA */}
      <main className="w-full max-w-7xl mx-auto px-6 py-20 flex flex-col items-center">
        
        {/* Error Handling - Centered */}
        {error && (
          <div className="max-w-md w-full bg-red-50 border border-red-200 p-10 rounded-[2.5rem] text-center shadow-sm">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold italic">
              !
            </div>
            <h2 className="text-2xl font-bold text-red-900 mb-2">Connection Issue</h2>
            <p className="text-red-600 leading-relaxed">{error}</p>
          </div>
        )}

        {/* Empty State - Centered */}
        {!error && activities.length === 0 && (
          <div className="w-full py-32 border-2 border-dashed border-slate-200 rounded-[3rem] flex flex-col items-center justify-center text-center">
            <p className="text-slate-400 text-2xl italic font-light">
              No publications have been shared yet. Check back soon!
            </p>
          </div>
        )}

        {/* Grid Display - Balanced & Centered */}
        {!error && activities.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 w-full justify-items-center">
            {activities.map((activity) => (
              <article 
                key={activity.id} 
                className="group flex flex-col bg-white rounded-[2rem] overflow-hidden border border-slate-100 transition-all duration-500 hover:shadow-[0_22px_50px_-12px_rgba(0,0,0,0.1)] hover:border-sky-100 max-w-[400px] w-full"
              >
                {/* Media Section */}
                <div className="relative h-72 w-full bg-slate-50 overflow-hidden">
                  {activity.media && activity.media.length > 0 ? (
                    activity.media[0].media_type === 'image' ? (
                      <Image
                        src={`/uploads/activities/${activity.media[0].file_name}`}
                        alt={activity.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-slate-800 text-slate-500 italic text-sm">
                        Multimedia Content
                      </div>
                    )
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-200 font-bold text-6xl">
                      ...
                    </div>
                  )}

                  {/* Centered Floating Badge */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                    <span className="bg-white/95 backdrop-blur text-slate-900 text-[10px] font-black uppercase tracking-[0.2em] px-5 py-2 rounded-full shadow-xl border border-slate-100">
                      {activity.type}
                    </span>
                  </div>
                </div>

                {/* Text Content - Centered Text */}
                <div className="p-10 flex flex-col items-center text-center flex-grow">
                  <div className="flex items-center gap-2 text-sky-500 text-[10px] font-black uppercase tracking-[0.15em] mb-4">
                    {format(new Date(activity.created_at), 'MMM dd, yyyy')}
                  </div>

                  <h3 className="text-2xl font-extrabold text-slate-900 mb-4 leading-[1.2] group-hover:text-sky-600 transition-colors">
                    {activity.title}
                  </h3>

                  <p className="text-slate-500 text-[15px] leading-relaxed mb-8 line-clamp-3">
                    {activity.description}
                  </p>

                  {/* Centered Footer */}
                  <div className="mt-auto w-full pt-8 border-t border-slate-50 flex flex-col items-center gap-4">
                    {activity.event_date && (
                      <div className="flex flex-col items-center">
                        <span className="text-[9px] uppercase font-black text-slate-300 tracking-widest mb-1">Event Date</span>
                        <span className="text-sm font-bold text-slate-800">
                          {format(new Date(activity.event_date), 'MMMM do, yyyy')}
                        </span>
                      </div>
                    )}
                    
                    <button className="px-8 py-3 rounded-full bg-slate-900 text-white text-xs font-bold uppercase tracking-widest hover:bg-sky-600 transition-all active:scale-95 shadow-lg shadow-slate-200 hover:shadow-sky-200">
                      Read More
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
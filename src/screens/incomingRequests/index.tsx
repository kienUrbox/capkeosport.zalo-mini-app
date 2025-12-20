import { useNavigate } from 'react-router-dom'

import { EmptyState } from '../../components/common'
import { Badge, PrimaryButton, SecondaryButton } from '../../components/ui'
import { ICONS } from '../../constants/design'

type IncomingRequest = {
  id: string
  team: {
    name: string
    logo: string
    gender: 'Male' | 'Female' | 'Co-ed'
  }
  message: string
  date: string
  time: string
  location: string
}

const IncomingRequestsScreen = () => {
  const navigate = useNavigate()

  // Mock data - sẽ thay bằng API call
  const requests: IncomingRequest[] = [
    {
      id: '1',
      team: {
        name: 'Red Devils FC',
        logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC6zIkcbXWzrj1F9C6OA9A6SVVrdzZyXANuCgYdjaAAmF5pliC80JWyezzBQp8LHdpDixK9Cze9N2YNdZz8ez9JAdzTXoJ_HR3sruDpzPxy3Dfueu6VH-XX3NWf9jQSQ2TPQ7CJeoL7kzaevc_ulVU-EVCBQzPIqSlEA57tLW4fhTGP-03jpU2REEPTbXq0KxSx_6Cwf4oqyihEfrr-9rl0Yz0MiZggyp09A24D-P2qvudKrKqv1c8knT7kW3VZqPQ3r3gtG69kd-4',
        gender: 'Male',
      },
      message: "Hey! We saw you're free this weekend. Fancy a friendly match?",
      date: 'Sat, 28 Oct',
      time: '19:00',
      location: 'Hoang Mai Pitch',
    },
    {
      id: '2',
      team: {
        name: 'Blue Lions',
        logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAS5a8_Eyxl4u4h2Ln8fE2Xt-KIQkauHjoKpgprZVCQJ_0IcwM6qcT6nXe_isqdKcVUHm-ToU2rmopWT6ZFBuKwXgN0ty_jYsqjhxPbTpsUJwhJBtwoVdFYSYnZ6SfggwJX_43OlnzR7lOlUgka4D6yl3SI6-73G6DO9BAJl7AoOHhX2QWk-KePFII5E0OjAH0YDrheU5EqcAzfPF-osfqUWcbsmmMOCr0BJCIpfLh2Z7HMhOGuTnUoRBzHbFxQLgOb_Ngz4B7OUCM',
        gender: 'Co-ed',
      },
      message: 'Looking for a competitive game this Sunday afternoon. Let us know!',
      date: 'Sun, 29 Oct',
      time: '15:00',
      location: 'Thanh Xuan Pitch',
    },
  ]

  const handleAccept = (requestId: string) => {
    // TODO: API call to accept request
    console.log('Accepting request:', requestId)
    navigate(`/match-room/${requestId}`)
  }

  const handlePropose = (requestId: string) => {
    // TODO: Navigate to propose alternative
    console.log('Proposing alternative for:', requestId)
  }

  const handleDecline = (requestId: string) => {
    // TODO: API call to decline request
    console.log('Declining request:', requestId)
  }

  if (requests.length === 0) {
    return (
      <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark group/design-root overflow-x-hidden">
        <header className="sticky top-0 z-10 flex h-16 items-center bg-background-light/80 dark:bg-background-dark/80 px-4 backdrop-blur-sm">
          <div className="flex size-12 shrink-0 items-center justify-start">
            <button onClick={() => navigate(-1)}>
              <span className={`material-symbols-outlined text-zinc-900 dark:text-white`}>{ICONS.arrow_back_ios_new}</span>
            </button>
          </div>
          <h1 className="flex-1 text-center text-lg font-bold leading-tight tracking-[-0.015em] text-zinc-900 dark:text-white">
            Incoming Requests
          </h1>
          <div className="flex size-12 shrink-0 items-center justify-end">
            <button className="flex h-12 max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full bg-transparent p-0 text-zinc-900 dark:text-white">
              <span className="material-symbols-outlined">{ICONS.tune}</span>
            </button>
          </div>
        </header>
        <EmptyState
          icon={<span className={`material-symbols-outlined text-5xl text-zinc-400 dark:text-zinc-500`}>{ICONS.inbox}</span>}
          title="All Caught Up!"
          description="You have no new match requests at the moment."
        />
      </div>
    )
  }

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark group/design-root overflow-x-hidden">
      {/* Top App Bar */}
      <header className="sticky top-0 z-10 flex h-16 items-center bg-background-light/80 dark:bg-background-dark/80 px-4 backdrop-blur-sm">
        <div className="flex size-12 shrink-0 items-center justify-start">
          <button onClick={() => navigate(-1)}>
            <span className="material-symbols-outlined text-zinc-900 dark:text-white">arrow_back_ios_new</span>
          </button>
        </div>
        <h1 className="flex-1 text-center text-lg font-bold leading-tight tracking-[-0.015em] text-zinc-900 dark:text-white">
          Incoming Requests
        </h1>
        <div className="flex size-12 shrink-0 items-center justify-end">
          <button className="flex h-12 max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full bg-transparent p-0 text-zinc-900 dark:text-white">
            <span className="material-symbols-outlined">tune</span>
          </button>
        </div>
      </header>

      <main className="flex-1 space-y-4 p-4">
        {requests.map((request) => (
          <div key={request.id} className="flex flex-col gap-3 rounded-xl bg-white dark:bg-[#1E1E1E] p-4">
            <div className="flex items-start gap-4">
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-[60px] w-[60px] shrink-0"
                style={{ backgroundImage: `url(${request.team.logo})` }}
              />
              <div className="flex flex-1 flex-col">
                <div className="flex items-center gap-2">
                  <p className="text-zinc-900 dark:text-white text-base font-semibold leading-normal">
                    {request.team.name}
                  </p>
                  <Badge
                    label={request.team.gender}
                    variant={request.team.gender === 'Male' ? 'primary' : request.team.gender === 'Female' ? 'info' : 'default'}
                  />
                </div>
                <p className="text-zinc-600 dark:text-[#A0A0A0] text-sm font-normal leading-normal mt-1">
                  {request.message}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-zinc-600 dark:text-[#A0A0A0]">
                <span className={`material-symbols-outlined text-base`}>{ICONS.calendar_today}</span>
                <p className="text-sm font-normal leading-normal">
                  {request.date} - {request.time}
                </p>
              </div>
              <div className="flex items-center gap-2 text-zinc-600 dark:text-[#A0A0A0]">
                <span className={`material-symbols-outlined text-base`}>{ICONS.location_on}</span>
                <p className="text-sm font-normal leading-normal">{request.location}</p>
              </div>
            </div>
            <div className="mt-2 flex flex-col gap-3">
              <div className="flex flex-1 gap-3 flex-wrap">
                <PrimaryButton
                  className="flex-1"
                  onClick={() => handleAccept(request.id)}
                >
                  Accept
                </PrimaryButton>
                <SecondaryButton
                  className="flex-1"
                  onClick={() => handlePropose(request.id)}
                >
                  Propose
                </SecondaryButton>
              </div>
              <div className="flex justify-center">
                <button
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 flex-1 bg-transparent text-red-500 dark:text-[#E53935] text-sm font-bold leading-normal tracking-[0.015em]"
                  onClick={() => handleDecline(request.id)}
                >
                  <span className="truncate">Decline</span>
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Empty State Card (if all processed) */}
        <div className="flex flex-col items-center justify-center rounded-xl bg-white dark:bg-[#1E1E1E] p-8 text-center mt-8">
          <span className={`material-symbols-outlined text-5xl text-zinc-400 dark:text-zinc-500`}>{ICONS.inbox}</span>
          <h3 className="mt-4 text-base font-semibold text-zinc-900 dark:text-white">All Caught Up!</h3>
          <p className="mt-1 text-sm text-zinc-600 dark:text-[#A0A0A0]">You have no new match requests at the moment.</p>
        </div>
      </main>
    </div>
  )
}

export default IncomingRequestsScreen

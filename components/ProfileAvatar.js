import Image from 'next/image'

const ProfileAvatar = () => (
  <div className="w-full h-full rounded-full overflow-hidden">
    <Image
      src="/profile.jpg"
      alt="Profile Avatar"
      width={40}
      height={40}
      className="object-cover w-full h-full"
    />
  </div>
)

export default ProfileAvatar
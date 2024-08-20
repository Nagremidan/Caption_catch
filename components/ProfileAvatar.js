import Image from 'next/image'

const ProfileAvatar = () => (
  <div className="w-16 h-16 bg-white rounded-full overflow-hidden">
    <Image
      src="/profile.jpg"
      alt="Profile Avatar"
      width={64}
      height={64}
      className="object-cover w-full h-full"
    />
  </div>
)

export default ProfileAvatar
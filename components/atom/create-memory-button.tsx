import { Button } from '../ui/button'

interface CreateMemoryButtonProps {
  onClick: () => void
}

export default function CreateMemoryButton({
  onClick,
}: CreateMemoryButtonProps) {
  return (
    <Button
      onClick={onClick}
      className="fixed left-5 bottom-4 z-50 rounded-full shadow-lg text-white"
    >
      書く
    </Button>
  )
}

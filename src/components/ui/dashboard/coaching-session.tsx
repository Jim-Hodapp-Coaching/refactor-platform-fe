import { ReactNode } from 'react'
import { Card, CardContent } from '@/components/ui/card'

interface CardSelectProps {
    children: ReactNode
    className?: string
}

export function CardSelect({ children, className = "w-[300px]" }: CardSelectProps) {
    return (
        <Card className={className}>
            <CardContent className="p-4">
                {children}
            </CardContent>
        </Card>
    )
}
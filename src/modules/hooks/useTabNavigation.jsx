import { useEffect } from 'react'

export const useTabNavigation = (watch, formRef) => {
    useEffect(() => {
        const handleKeyDown = (e) => {
            console.log(document.activeElement.tagName);
            if (e.key !== 'Tab' || e.shiftKey) return

            const activeElement = document.activeElement

            console.log(activeElement.tagName);

            const isFormField = ['INPUT', 'TEXTAREA', 'SELECT', 'SPAN'].includes(
                activeElement.tagName
            )

            if (!isFormField) return

            const form = formRef.current
            if (!form) return

            const allFields = Array.from(
                form.querySelectorAll(
                    'input:not([type="hidden"]):not([disabled]), textarea:not([disabled]), select:not([disabled])'
                )
            )

            const currentIndex = allFields.indexOf(activeElement)
            if (currentIndex === -1) return

            let nextEmptyFieldIndex = -1

            for (let i = currentIndex + 1; i < allFields.length; i++) {
                const field = allFields[i]
                const fieldName = field.getAttribute('name')

                const fieldValue = watch(fieldName)

                const isEmpty =
                    fieldValue === undefined ||
                    fieldValue === null ||
                    fieldValue === '' ||
                    (Array.isArray(fieldValue) && fieldValue.length === 0)

                if (isEmpty) {
                    nextEmptyFieldIndex = i
                    break
                }
            }

            if (nextEmptyFieldIndex !== -1) {
                e.preventDefault()
                const nextField = allFields[nextEmptyFieldIndex]
                nextField.focus()

                nextField.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                })
            }
        }

        document.addEventListener('keydown', handleKeyDown)

        return () => {
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [watch, formRef])
}
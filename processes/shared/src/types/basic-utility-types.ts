export type Keys<T> = Array<keyof T>

export type AnyArray = Array<any>

export type Callback = () => void

export type NotUndefinded<T> = T extends undefined ? never : T

export type PartialBy<T, K extends keyof T> = Omit<T, K> & {
	[ P in K ]?: T[ P ]
}

export type RequiredBy<T, K extends keyof T> = Omit<T, K> &
	Required<{
		[ P in K ]: NotUndefinded<T[ P ]>
	}>

export type NonNullableProperties<T, K extends keyof T = keyof T> = {
	[ P in keyof T ]: P extends K ? NonNullable<T[ P ]> : T[ P ]
}

export type Merge<A, B> = A | B extends object
	? Omit<A, keyof B> & Omit<B, keyof A> & { [ K in keyof ( A | B ) ]: Merge<A[ K ], B[ K ]> }
	: B

export type DeepPartial<T> = T extends object ? { [ K in keyof T ]?: DeepPartial<T[ K ]> } : T

export type PropertyOf<T> = T[ keyof T ]

export type Properties<T> = Array<PropertyOf<T>>

export type Overwrite<T, K extends keyof T, P> = {
	[ Key in keyof T ]: Key extends K ? P : T[ Key ]
}
export type OverwriteProperties<T, P> = Record<keyof T, P>

export type NeverProperties<T> = { [ _ in keyof T ]?: never }

export type Without<A, B> = Omit<A, keyof B>

export type XOR<A, B> = A | B extends object
	? ( B & NeverProperties<Without<A, B>> ) | ( A & NeverProperties<Without<B, A>> )
	: A | B

export type Entries<T> = Array<[ keyof T, PropertyOf<T> ]>

export type Rename<T, OK extends keyof T, NK extends string> = Omit<T, OK> & { [ _ in NK ]: T[ OK ] }

export type PickKeyof<T, K extends keyof T> = Extract<keyof T, K>

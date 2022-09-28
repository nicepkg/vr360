export type ConfigModel = {
  id: string
}

export type ConfigModelManager<CM extends ConfigModel, TM> = {
  create(configModel: CM): TM
  add(configModel: CM): TM
  update(configModel: Partial<CM> & Pick<CM, 'id'>): TM | undefined
  find(configModel: string | (Partial<CM> & Pick<CM, 'id'>)): TM | undefined
  findOrCreate(configModel: CM): TM
  remove(configModel: string | (Partial<CM> & Pick<CM, 'id'>)): void
  removeAll(): void
  destroy(): void
}

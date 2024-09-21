/* eslint-disable no-console */
import { groupStoredMessagesByYearAndMonth } from './index'

groupStoredMessagesByYearAndMonth()
  .then(() => {
    console.log('Done')
  })
  .catch((err: any) => {
    console.log(err)
  })

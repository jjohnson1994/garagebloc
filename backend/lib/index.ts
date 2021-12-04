import MyStack from './MyStack'
import * as sst from '@serverless-stack/resources'

export default function main(app: sst.App): void {
  app.setDefaultFunctionProps({
    runtime: 'nodejs12.x'
  })

  new MyStack(app, 'the-board')
}

import { expose } from '../../utils/config'
import Layout from './layout'
import Header from './header'
import Aside from './aside'
import Main from './main'
import Footer from './footer'

export default expose(Layout, Header, Aside, Main, Footer)

export { Layout, Header, Aside, Main, Footer }

export type LayoutInstance = InstanceType<typeof Layout>
export type HeaderInstance = InstanceType<typeof Header>
export type AsideInstance = InstanceType<typeof Aside>
export type MainInstance = InstanceType<typeof Main>
export type FooterInstance = InstanceType<typeof Footer>

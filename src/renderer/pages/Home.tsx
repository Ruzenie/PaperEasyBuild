import {Layout} from'antd';
import React from 'react';
const { Header, Footer, Content } = Layout;

const headerStyle: React.CSSProperties = {
    textAlign: 'left',
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#000000',
    height: 64,
    paddingInline: 48,
    lineHeight: '64px',
    backgroundColor: '#ffffffff',
    borderBottom: '1px solid #e8e8e8'
};

const Home: React.FC = () => { 
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header style={headerStyle}>PaperEasyBuild 低代码平台</Header>
            <Content style={{ padding: '24px' }}>
                <h1>欢迎使用 PaperEasy!</h1>
                <p>这是一个基于 Electron 和 React 的问卷低代码平台。</p>
            </Content>
            <Footer style={{ textAlign: 'center' }}>PaperEasy ©2024 Created by YourName</Footer>
        </Layout>
    );
}
export default Home;
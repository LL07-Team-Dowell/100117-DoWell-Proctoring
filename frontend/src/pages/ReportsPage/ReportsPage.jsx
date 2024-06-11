import constructionIllustration from '../../assets/under-construction.png';


const ReportsPage = () => {
    return <section style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
    }}>
        <img 
            src={constructionIllustration}
            alt="construction"
            style={{
                maxWidth: '100%',
                width: '30%'
            }}
        />
    </section>
}

export default ReportsPage;
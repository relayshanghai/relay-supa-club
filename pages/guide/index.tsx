import { Layout } from 'src/components/layout';
import { GuideComponent } from 'src/components/guide';

const Guide = () => {
    const title = 'Building a Node.js Server';
    const description =
        'Lorem ipsut utfaucibus purus in massa tempor nec feugiat. Tellus cras adipiscing enim eu turpis egestas. Nec nam aliquam sem et. Vel pharetra vel turpis nunc eget lorem dolor sed. Eget gravida cum sociis natoque penatibus et magnis. Vitae tortor condimentum lacinia quis vel. Vitae proin sagittis nisl rhoncus mattis rhoncus urna neque viverra. Sed viverra tellus in hac habitasse platea dictumst vestibulum. Sollicitudin aliquam ultrices sagittis orci a scelerisque purus. Viverra tellus in hac habitasse. Egestas sed tempus urna et pharetra pharetra. Elit duis tristique sollicitudin nibh sit amet commodo nulla. Eleifend mi in nulla posuere sollicitudin aliquam ultrices sagittis orci. Ullamcorper morbi tincidunt ornare massa eget egestas purus viverra accumsan. Ut porttitor leo a diam sollicitudin tempor id. Nunc non blandit massa enim nec dui nunc mattis enim. Pellentesque sit amet porttitor eget dolor morbi non arcu. Malesuada fames ac turpis egestas sed tempus urna. Odio pellentesque diam volutpat commodo sed egestas egestas fringilla. Sit amet nisl purus in mollis nunc. Tincidunt id aliquet risus feugiat in. Cursus turpis massa tincidunt dui ut ornare lectus. Facilisis magna etiam tempor orci eu lobortis elementum nibh. Habitasse platea dictumst vestibulum rhoncus est pellentesque. Volutpat consequat mauris nunc cos nullam eget. Faucibus pulvinar eletae sapien.';
    return (
        <Layout>
            <div className="m-6">
                <h1 className="text-4xl font-bold">Guides</h1>
                <div className="m-auto flex flex-col">
                    <GuideComponent title={title} description={description} image="agency.svg" />
                    <GuideComponent title={title} description={description} image="agency.svg" />
                    <GuideComponent title={title} description={description} image="agency.svg" />
                </div>
            </div>
        </Layout>
    );
};

// generate a large lorem text
// https://loremipsum.io/generator/?n=5&t=p
export default Guide;

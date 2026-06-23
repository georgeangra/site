import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const sliderImages = [
  'https://d2xsxph8kpxj0f.cloudfront.net/310519663403688099/nseNGRfV33pzwCpFGwm8bx/slider-sofa-1-dNto9Ss8qHgUmbzjEEti8j.webp',
  'https://d2xsxph8kpxj0f.cloudfront.net/310519663403688099/nseNGRfV33pzwCpFGwm8bx/slider-sofa-2-XM7WZVEjCfwKCvCxe6i7JN.webp',
  'https://d2xsxph8kpxj0f.cloudfront.net/310519663403688099/nseNGRfV33pzwCpFGwm8bx/slider-chair-DrVuSqDe9EYvDM85BpY7kQ.webp',
  'https://d2xsxph8kpxj0f.cloudfront.net/310519663403688099/nseNGRfV33pzwCpFGwm8bx/slider-curtains-MbnBc6vtn783oXbmGo2wM8.webp',
  'https://d2xsxph8kpxj0f.cloudfront.net/310519663403688099/nseNGRfV33pzwCpFGwm8bx/slider-sofa-3-AGMchukWDu3wpL859xuYVD.webp',
];

const logoUrl = '/logo_lavmaster.jpeg';
const smallLogoUrl = '/logo_lavmaster.jpeg';

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: '',
    message: '',
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const fullPhoneText = '(62) 99315-8050';
  const [typedPhone, setTypedPhone] = useState('');
useEffect(() => {
    let index = 0;
    let typingInterval: ReturnType<typeof setInterval>;
    let restartTimeout: ReturnType<typeof setTimeout>;

    const startTyping = () => {
      index = 0;
      setTypedPhone('');
      typingInterval = setInterval(() => {
        index++;
        setTypedPhone(fullPhoneText.slice(0, index));

        if (index >= fullPhoneText.length) {
          clearInterval(typingInterval);
          restartTimeout = setTimeout(startTyping, 3000);
        }
      }, 150);
    };

    startTyping();

    return () => {
      clearInterval(typingInterval);
      clearTimeout(restartTimeout);
    };
  }, []);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleFormChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleServiceChange = (value: string) => {
    setFormData((prev) => ({ ...prev, service: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('sending');
    setStatusMessage('Enviando solicita­ção...');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao enviar formulário');
      }

      setFormStatus('success');
      setStatusMessage('Solicita­ção enviada com sucesso! Em breve entraremos em contato.');
      setFormData({ name: '', phone: '', service: '', message: '' });
      setTimeout(() => setFormStatus('idle'), 5000);
    } catch (error) {
      console.error(error);
      setFormStatus('error');
      setStatusMessage('Não foi possível enviar sua solicita­ção. Tente novamente mais tarde.');
      setTimeout(() => setFormStatus('idle'), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-white">

      {/* ✅ HEADER CORRETO */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">

          <div className="flex items-center gap-4">

            <img src={smallLogoUrl} alt="Lav Master Logo" className="w-22 h-22 object-contain" />

            <a href="#" className="cursor-pointer">
              <h1 className="text-xl font-bold">
                LAV{' '}
                <span className="bg-gradient-to-b from-blue-300 via-blue-500 to-blue-900 bg-clip-text text-transparent">
                  MASTER
                </span>
              </h1>
            </a>

            <a
              href="https://wa.me/5562993158050"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-900 font-semibold hover:text-green-700 transition ml-2 inline-block min-w-[150px]"
            >
              {typedPhone}
              <span className="inline-block w-[2px] h-4 bg-gray-900 ml-1 animate-pulse align-middle"></span>
            </a>

          </div>

          <nav className="hidden md:flex gap-8">
            <a href="#servicos" className="text-gray-700 hover:text-green-600 transition">Serviços</a>
            <a href="#contato" className="text-gray-700 hover:text-green-600 transition">Contato</a>
          </nav>

          <a
            href="https://wa.me/5562993158050"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            <i className="fab fa-whatsapp"></i>
            WhatsApp
          </a>

        </div>
      </header>

      {/* O RESTO DO SEU CÓDIGO FICA IGUAL */}

     {/* Hero Section with Slider */}
      <section className="mt-20 h-96 md:h-[500px] relative overflow-hidden">
        {sliderImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-600 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img src={image} alt={`Slide ${index + 1}`} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/30"></div>
          </div>
        ))}

        {/* Hero Content */}
        <div className="absolute inset-0 flex items-center justify-start pl-8 md:pl-16">
          <div className="max-w-lg text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Sofá livre de ácaros, manchas e odores sem sair de casa
            </h2>
            <a
              href="https://wa.me/5562993158050"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-green-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-700 transition transform hover:scale-105"
            >
              <i className="fab fa-whatsapp text-xl"></i>
              Solicitar Orçamento
            </a>
          </div>
        </div>

        {/* Slider Indicators */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
          {sliderImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition ${
                index === currentSlide ? 'bg-white' : 'bg-white/50'
              }`}
            ></button>
          ))}
        </div>
      </section>

      {/* Green Divider Line */}
      <div className="h-1 bg-green-600"></div>

      {/* Services Section */}
      <section id="servicos" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4 text-blue-900">
            Nossos Serviços
          </h2>
          <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">
            Oferecemos higienização profissional para todos os tipos de estofados, com tecnologia de ponta e produtos seguros.
          </p>

          <div className="grid md:grid-cols-5 gap-8">
            {[
              { icon: 'fa-couch', title: 'Sofás', desc: 'Limpeza profunda e higienização' },
              { icon: 'fa-chair', title: 'Cadeiras', desc: 'Restauração e limpeza' },
              { icon: 'fa-rug', title: 'Tapetes', desc: 'Higienização completa' },
              { icon: 'fa-window-maximize', title: 'Cortinas', desc: 'Limpeza delicada' },
              { icon: 'fa-bed', title: 'Colchões', desc: 'Desinfecção profissional' },
            ].map((service, index) => (
              <div key={index} className="text-center p-6 rounded-lg bg-gray-50 hover:shadow-lg transition">
                <i className={`fas ${service.icon} text-4xl text-green-600 mb-4`}></i>
                <h3 className="text-xl font-bold text-blue-900 mb-2">{service.title}</h3>
                <p className="text-gray-600 text-sm">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Green Divider Line */}
      <div className="h-1 bg-green-600"></div>

      {/* Contact Form Section */}
      <section id="contato" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Form */}
            <div>
              <h2 className="text-4xl font-bold mb-6 text-blue-900">
                Solicitar Orçamento
              </h2>
              <p className="text-gray-600 mb-8">
                Preencha o formulário abaixo e nossa equipe entrará em contato com você em breve.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nome</label>
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    placeholder="Seu nome completo"
                    required
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Telefone</label>
                  <Input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleFormChange}
                    placeholder="(62) 99999-9999"
                    required
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Tipo de Serviço</label>
                  <Select value={formData.service} onValueChange={handleServiceChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione um serviço" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sofa">Sofá</SelectItem>
                      <SelectItem value="cadeira">Cadeira</SelectItem>
                      <SelectItem value="tapete">Tapete</SelectItem>
                      <SelectItem value="cortina">Cortina</SelectItem>
                      <SelectItem value="colchao">Colchão</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Mensagem</label>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleFormChange}
                    placeholder="Descreva seu pedido..."
                    className="w-full"
                    rows={4}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={formStatus === 'sending'}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <i className="fas fa-envelope mr-2"></i>
                  {formStatus === 'sending' ? 'Enviando...' : 'Enviar por Email'}
                </Button>
                {formStatus !== 'idle' && (
                  <p
                    className={`mt-3 text-sm text-center ${
                      formStatus === 'success' ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'
                    }`}
                  >
                    {statusMessage}
                  </p>
                )}
              </form>
            </div>

            {/* Map */}
            <div>
              <h2 className="text-4xl font-bold mb-6 text-blue-900">
                Nossa Localização
              </h2>
              <p className="text-gray-600 mb-8">
                Visite nossa unidade ou entre em contato para agendar um atendimento.
              </p>

              <div className="rounded-lg overflow-hidden shadow-lg h-96">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.0789472943!2d-49.3030135!3d-16.6982857!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x935ef5d159d50839%3A0xbf560b97eb2fb24f!2sLAVMASTER%2C%20Goi%C3%A2nia%2C%20GO!5e0!3m2!1spt-BR!2sbr!4v1719084000000"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>

              <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-bold text-blue-900 mb-4">Informações de Contato</h3>
                <div className="space-y-3">
                  <p className="flex items-center gap-3 text-gray-700">
                    <i className="fas fa-phone text-green-600 w-5"></i>
                    <a href="https://wa.me/5562993158050" className="hover:text-green-600">(62) 99315-8050</a>
                  </p>
                  <p className="flex items-center gap-3 text-gray-700">
                    <i className="fas fa-map-marker-alt text-green-600 w-5"></i>
                    Goiânia, GO
                  </p>
                  <p className="flex items-center gap-3 text-gray-700">
                    <i className="fab fa-instagram text-green-600 w-5"></i>
                    <a href="https://www.instagram.com/masterlavanderiaoficial" target="_blank" rel="noopener noreferrer" className="hover:text-green-600">@masterlavanderiaoficial</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Green Divider Line */}
      <div className="h-1 bg-green-600"></div>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img src={logoUrl} alt="Lav Master Logo" className="h-16 w-16 object-contain rounded-full" />
              </div>
              <p className="text-gray-300">
                Higienização profissional de estofados com qualidade premium.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4">Links Rápidos</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#servicos" className="hover:text-green-400 transition">Serviços</a></li>
                <li><a href="#contato" className="hover:text-green-400 transition">Contato</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4">Redes Sociais</h4>
              <div className="flex gap-4">
                <a href="https://wa.me/5562993158050" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-green-400 transition text-xl">
                  <i className="fab fa-whatsapp"></i>
                </a>
                <a href="https://www.instagram.com/masterlavanderiaoficial" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-green-400 transition text-xl">
                  <i className="fab fa-instagram"></i>
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8 text-center text-gray-300">
            <p>&copy; 2026 Lav Master. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/5562993158050"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-green-700 transition transform hover:scale-110 animate-pulse"
        style={{
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        }}
      >
        <i className="fab fa-whatsapp text-3xl"></i>
      </a>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}


import UsernameImg from "../../assets/images/usernameIcon.svg"
import PasswordImg from "../../assets/images/passwordIcon.svg"

interface LoginProps {
  handleLoginClick: () => void
  handleCloseClick: () => void
}
const Login: React.FC<LoginProps> = ({ handleLoginClick, handleCloseClick }) => {
  const onLoginClick = () => {
    handleLoginClick()
  }

  const onCloseClick = () => {
    handleCloseClick()
  }

  return (
    <div className="login flex flex-col w-[500px] h-[300px] bg-black border-4 rounded-2xl border-red fixed top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] z-[1000]">
      <div className="text-3xl font-medium text-white ml-[22px] mt-[12px]">
        Login
      </div>
      <div className="border-t-4 border-red w-full self-center mt-[12px]" />
      <div className="w-full flex flex-col mt-[40px] items-center space-y-4">
        <div className="username flex flex-row items-center w-[400px] h-[36px] rounded-full bg-white border-dark-gray border-2 focus:outline-none focus:ring-1 focus:ring-white px-4">
          <img src={UsernameImg} alt="Username Icon" className="w-4 h-4 mr-4" />
          <input
            type="text"
            className="text-sm text-dark-gray w-full bg-transparent focus:outline-none"
            placeholder="Username"
            // value={}
            // onChange={}
          />
        </div>
        <div className="password flex flex-row items-center w-[400px] h-[36px] rounded-full bg-white border-dark-gray border-2 focus:outline-none focus:ring-1 focus:ring-white px-4">
          <img src={PasswordImg} alt="Password Icon" className="w-4 h-4 mr-4" />
          <input
            type="password"
            className="text-sm text-dark-gray w-full bg-transparent focus:outline-none"
            placeholder="Password"
            // value={}
            // onChange={}
          />
        </div>
        <div className="flex flex-row items-center w-full justify-center">
          <button
            className="LoginBtn mt-2 w-[190px] h-9 border-2 border-red bg-red text-white text-[16px] font-bold rounded-full items-center justify-center tracking-widest hover:bg-dark-red hover:border-dark-red duration-200"
            onClick={onLoginClick}
          >
            Log in
          </button>
          <button
            className="CloseBtn mt-2 ml-5 w-[190px] h-9 border-2 border-red bg-black text-red text-[16px] font-bold rounded-full items-center justify-center tracking-widest hover:bg-[#380005] duration-200"
            onClick={onCloseClick}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login

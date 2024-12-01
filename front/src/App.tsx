import { CreateUser } from "./CreateUser"
import { useGetUsers } from "./http/generated/api"


function App() {
const {data: users} = useGetUsers()


  return (
    <div>
      <ul>
        {users?.data.map((item)=>{
          return(
            <li key={item.id}>{item.name}</li>
          )
        })}
      </ul>

      <CreateUser/>
    </div>
  )
}

export default App
